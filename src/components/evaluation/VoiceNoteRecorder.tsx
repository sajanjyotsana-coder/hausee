import { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2 } from 'lucide-react';
import { EvaluationVoiceNote } from '../../types';

interface VoiceNoteRecorderProps {
  voiceNotes: EvaluationVoiceNote[];
  onSave: (audioBlob: Blob, duration: number) => Promise<void>;
  onDelete: (voiceNoteId: string) => Promise<void>;
  isSaving?: boolean;
}

export default function VoiceNoteRecorder({
  voiceNotes,
  onSave,
  onDelete,
  isSaving = false,
}: VoiceNoteRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      audioElementsRef.current.forEach((audio) => {
        audio.pause();
        audio.src = '';
      });
      audioElementsRef.current.clear();
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const duration = recordingTime;

        stream.getTracks().forEach((track) => track.stop());

        if (timerRef.current) {
          clearInterval(timerRef.current);
        }

        await onSave(audioBlob, duration);

        setRecordingTime(0);
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to access microphone. Please grant permission and try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const togglePlayPause = useCallback((voiceNote: EvaluationVoiceNote) => {
    const audio = audioElementsRef.current.get(voiceNote.id) || new Audio(voiceNote.storagePath);

    if (!audioElementsRef.current.has(voiceNote.id)) {
      audioElementsRef.current.set(voiceNote.id, audio);

      audio.onended = () => {
        setPlayingId(null);
      };
    }

    if (playingId === voiceNote.id) {
      audio.pause();
      setPlayingId(null);
    } else {
      audioElementsRef.current.forEach((otherAudio, id) => {
        if (id !== voiceNote.id) {
          otherAudio.pause();
        }
      });

      audio.play();
      setPlayingId(voiceNote.id);
    }
  }, [playingId]);

  const handleDelete = async (voiceNoteId: string) => {
    setDeletingId(voiceNoteId);
    try {
      const audio = audioElementsRef.current.get(voiceNoteId);
      if (audio) {
        audio.pause();
        audio.src = '';
        audioElementsRef.current.delete(voiceNoteId);
      }
      if (playingId === voiceNoteId) {
        setPlayingId(null);
      }
      await onDelete(voiceNoteId);
    } finally {
      setDeletingId(null);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Voice Notes ({voiceNotes.length})
      </label>

      {voiceNotes.length > 0 && (
        <div className="space-y-2">
          {voiceNotes.map((note) => (
            <div
              key={note.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <button
                onClick={() => togglePlayPause(note)}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-primary-400 hover:bg-primary-500 text-white rounded-full transition-colors"
              >
                {playingId === note.id ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">
                  Voice Note {voiceNotes.indexOf(note) + 1}
                </div>
                <div className="text-xs text-gray-500">
                  {formatTime(note.duration)}
                </div>
              </div>

              <button
                onClick={() => handleDelete(note.id)}
                disabled={deletingId === note.id}
                className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        {isRecording ? (
          <>
            <button
              onClick={stopRecording}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <Square className="w-5 h-5" />
              Stop Recording
            </button>
            <div className="px-4 py-3 bg-gray-100 rounded-lg font-mono text-sm text-gray-900 min-w-[80px] text-center">
              {formatTime(recordingTime)}
            </div>
          </>
        ) : (
          <button
            onClick={startRecording}
            disabled={isSaving}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-400 hover:bg-primary-500 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                Start Recording
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
