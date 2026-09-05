import os
import yt_dlp

# ВСТАВ СЮДИ ПОСИЛАННЯ НА КОНКРЕТНЕ ВІДЕО З YOUTUBE (наприклад, промо-ролик Буковелю):
YOUTUBE_URL = "https://www.youtube.com/watch?v=oA2AVIy_5Os"

# Визначаємо чіткий шлях прямо в папку static/images
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
output_path = os.path.join(BASE_DIR, "static", "images", "bg_video.mp4")

ydl_opts = {
    # Завантажуємо найкраще відео у форматі mp4 (без звуку, бо для фону сайту звук не потрібен)
    'format': 'bestvideo[ext=mp4]/best[ext=mp4]',
    'outtmpl': output_path,
    'nocheckcertificate': True,
    'quiet': False
}

print("🚀 Починаємо завантаження відео прямо в папку images...")
try:
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([YOUTUBE_URL])
    print("✨ Успішно! Відео завантажено та збережено у app/static/images/bg_video.mp4")
except Exception as e:
    print(f"❌ Виникла помилка: {e}")