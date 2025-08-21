// Simple base64 encoded beep sound for Miku interactions
// This is a placeholder - in a real app you'd have actual Miku audio files
export const MIKU_BEEP_SOUND = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcAyyL2fXEdiUFKIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiP2O/BdiUFJoXO8tmIOQkVYrjm6aJVFAlKn+LxUhHkTsONxP7GhT1OWATWIy5jbPZhQGAJgZDLdcN2ZTpH';

export const playMikuSound = () => {
    if (typeof window !== 'undefined' && window.Audio) {
        try {
            const audio = new Audio(MIKU_BEEP_SOUND);
            audio.volume = 0.3; // Keep it subtle
            audio.play().catch(() => {
                // Ignore if audio playback fails (user hasn't interacted with page yet)
            });
        } catch (error) {
            // Ignore audio errors
        }
    }
};