# SirahVerse AI - Companion Sejarah Islam Interaktif

SirahVerse AI adalah aplikasi chatbot yang dirancang untuk menjadi teman belajar interaktif untuk sejarah Islam (Sirah Nabawiyah). Aplikasi ini didukung oleh Google Gemini dan dibangun dengan Node.js, Express, dan frontend HTML, CSS, dan JavaScript sederhana.

## 🌟 Fitur

-   **Antarmuka Chat Interaktif**: Ajukan pertanyaan tentang sejarah Islam dan dapatkan jawaban yang informatif.
-   **Didukung oleh Gemini**: Memanfaatkan model AI generatif Google untuk memberikan respons yang dinamis dan kontekstual.
-   **Pengetahuan Khusus**: Model AI diinstruksikan secara khusus untuk bertindak sebagai "Interactive Islamic History Companion", dengan fokus pada sumber-sumber yang dapat diandalkan dan penyajian yang edukatif.
-   **Dukungan Markdown**: Respons dari bot diformat dengan baik menggunakan Markdown untuk keterbacaan yang lebih baik.
-   **Penanganan Error**: Menampilkan pesan error yang jelas, termasuk untuk masalah kuota API.

## 🛠️ Setup dan Instalasi

Proyek ini dapat dijalankan menggunakan Node.js secara langsung atau menggunakan Nix dengan `devenv` untuk lingkungan pengembangan yang terisolasi.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v22 atau lebih tinggi direkomendasikan)
-   npm (biasanya terinstal bersama Node.js)
-   Sebuah API Key dari [Google AI Studio](https://aistudio.google.com/app/apikey).

### Metode 1: Menggunakan Node.js

1.  **Clone repositori ini:**
    ```bash
    git clone https://github.com/AkhyarAzamta/gemini-chatbot-api.git
    cd gemini-chatbot-api
    ```

2.  **Instal dependensi:**
    ```bash
    npm install
    ```

3.  **Buat file `.env`:**
    Buat file bernama `.env` di direktori root proyek dan tambahkan API key Anda:
    ```
    GOOGLE_API_KEY=apikey_anda_disini
    ```

4.  **Jalankan server pengembangan:**
    ```bash
    npm run dev
    ```
    Server akan berjalan di `http://localhost:3000`.

### Metode 2: Menggunakan Nix dan Devenv

Jika Anda memiliki [Nix](https://nixos.org/download.html) dan `direnv` terinstal, Anda dapat menggunakan lingkungan pengembangan yang telah dikonfigurasi.

1.  **Clone repositori ini:**
    ```bash
    git clone https://github.com/AkhyarAzamta/gemini-chatbot-api.git
    cd gemini-chatbot-api
    ```

2.  **Izinkan `direnv`:**
    Jalankan perintah berikut di root proyek untuk mengizinkan `direnv` memuat lingkungan Nix:
    ```bash
    direnv allow
    ```
    Ini akan secara otomatis mengunduh dan mengonfigurasi semua dependensi yang ditentukan dalam `flake.nix`.

3.  **Buat file `.env`:**
    Sama seperti metode sebelumnya, buat file `.env` dengan `GOOGLE_API_KEY` Anda.
    ```
    GOOGLE_API_KEY=apikey_anda_disini
    ```

4.  **Jalankan server pengembangan:**
    Lingkungan `devenv` menyediakan skrip yang mudah.
    ```bash
    npm run dev
    ```
    Atau, jika Anda sudah berada di dalam shell Nix:
    ```bash
    dev
    ```
    Server akan berjalan di `http://localhost:3000`.

## 🚀 Penggunaan

1.  Pastikan server sedang berjalan.
2.  Buka browser web Anda dan navigasikan ke `http://localhost:3000`.
3.  Ketik pertanyaan Anda tentang sejarah Islam di kolom input dan tekan Enter atau klik tombol kirim.
4.  Jawaban dari SirahVerse AI akan muncul di jendela chat.

## 📸 Tampilan

### Tampilan Chat
![Tampilan Chat](/public/assets/home.png)

### Contoh Jawaban
![Contoh Bepikir](/public/assets/chat1.png)
![Contoh Jawaban](/public/assets/chat2.png)
