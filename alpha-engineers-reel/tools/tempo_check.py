#!/usr/bin/env python3
"""Rough tempo check for a generated track.

    python3 tools/tempo_check.py music.wav   ->  "120.0 BPM"

Onset-strength autocorrelation, scored at 1, 2, 4 and 8 beats so the estimate is
accurate to about 0.1 BPM. Needs ffmpeg and numpy.
"""
import subprocess
import sys

import numpy as np

SR, HOP, WIN = 22050, 128, 1024
raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', sys.argv[1], '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                     capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32)
frames = np.array([np.abs(np.fft.rfft(x[i:i + WIN] * np.hanning(WIN))) for i in range(0, len(x) - WIN, HOP)])
onset = np.maximum(0, np.diff(np.log1p(50 * frames), axis=0)).sum(axis=1)
onset = np.maximum(0, onset - np.convolve(onset, np.ones(64) / 64, 'same'))
n = len(onset)
spec = np.fft.rfft(onset, 2 * n)
ac = np.fft.irfft(spec * np.conj(spec))[:n]          # autocorrelation via FFT
rate = SR / HOP


def at(lag):
    i = int(lag)
    w = lag - i
    return ac[i] * (1 - w) + ac[i + 1] * w if i + 1 < n else 0.0


bpms = np.arange(70, 180, 0.05)
score = [sum(at(k * 60 / b * rate) for k in (1, 2, 4, 8)) for b in bpms]
print(f'{bpms[int(np.argmax(score))]:.1f} BPM')
