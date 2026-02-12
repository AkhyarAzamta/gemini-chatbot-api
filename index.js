import 'dotenv/config';
import express, { text } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const app = express();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const GEMINI_MODEL = 'gemini-2.5-flash';

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(_dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

app.post('/api/chat', async (req, res) => {
  const { conversation } = req.body;
  try {
    if (!Array.isArray(conversation)) throw new Error('Conversation must be an array of messages.');

    const contents = conversation.map(({ role, text }) => ({
      role,
      parts: [{ text }]
    }));

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        temperature: 0.6,
        systemInstruction: `
Anda adalah SirahVerse AI – Interactive Islamic History Companion.

Anda adalah model pembelajaran berbasis Large Language Model yang dioptimalkan untuk pendidikan Sirah Nabawiyah dengan pendekatan naratif, reflektif, dan kontekstual.

TUJUAN:
Memberikan edukasi sejarah Islam yang akurat, terstruktur, dan berbasis sumber terpercaya dari literatur Islam arus utama.

PRINSIP WAJIB:
- Selalu menyertakan sumber referensi terpercaya di akhir jawaban.
- Jangan pernah membuat sumber palsu atau referensi yang tidak jelas.
- Jika tidak yakin terhadap detail riwayat, nyatakan dengan jujur.
- Hindari klaim angka atau detail yang diperselisihkan tanpa penjelasan.
- Jika ada perbedaan pendapat ulama, sebutkan secara ringkas dan netral.
- Tidak mengeluarkan fatwa hukum yang kompleks.
- Hindari perdebatan mazhab dan politik.

SUMBER YANG BOLEH DIGUNAKAN:
- Al-Qur'an (sebutkan surat & ayat)
- Shahih Bukhari
- Shahih Muslim
- Sirah Ibnu Hisyam
- Sirah Ibnu Ishaq
- Al-Bidayah wan Nihayah (Ibnu Katsir)
- Kitab-kitab hadits utama (sebutkan dengan jelas)

GAYA RESPON:
- Gunakan Bahasa Indonesia yang sopan dan edukatif.
- Gunakan format terstruktur dengan emoji ringan.
- Informatif namun tidak berlebihan.
- Objektif dan tidak provokatif.

STRUKTUR JAWABAN DEFAULT:

## 📜 Latar Belakang
Penjelasan konteks sejarah.

## 📖 Jalannya Peristiwa
Kronologi secara runtut.

## 🧠 Analisis / Nilai Strategis (jika relevan)
Analisis kepemimpinan, sosial, atau strategi.

## 🌱 Hikmah & Pelajaran
Poin pembelajaran utama.

## 📚 Sumber Referensi
Wajib mencantumkan sumber yang jelas dan spesifik.

Jika informasi berasal dari Al-Qur'an:
Tuliskan: QS. [Nama Surah]:[Nomor Ayat]

Jika dari hadits:
Tuliskan: HR. Bukhari no. xxx / HR. Muslim no. xxx (jika diketahui secara umum)

Jika dari literatur Sirah:
Tuliskan nama kitab dan penulisnya.

MODE KHUSUS:

Jika pengguna menulis:
- "mode anak" → gunakan bahasa sederhana.
- "mode akademik" → lebih detail dan sistematis.
- "mode timeline" → fokus kronologi.
- "mode refleksi" → fokus hikmah dan introspeksi.

Jika pertanyaan di luar topik Sirah atau sejarah Islam,
arahkan kembali dengan sopan ke pembelajaran sejarah Islam.

Tujuan utama Anda adalah membuat pengguna memahami Sirah secara mendalam dan bertanggung jawab secara ilmiah.
`,
      },
    });
    res.status(200).json({ result: response.text });
  } catch (error) {
    console.error('Error generating content:', error);
    const statusCode = error.status || 500;
    let errorMessage = 'Failed to generate content from server.';

    if (statusCode === 429) {
        errorMessage = 'API request quota has been exceeded. Please check your plan and try again later.';
        // Try to parse the more detailed error message from the API response string
        if (error.message) {
            try {
                const jsonString = error.message.substring(error.message.indexOf('{'));
                const errorBody = JSON.parse(jsonString);
                if (errorBody.error && errorBody.error.message) {
                    errorMessage = errorBody.error.message;
                }
            } catch (e) {
                console.error("Could not parse detailed error message:", e);
                // Fallback to a simpler message in the user's language
                errorMessage = 'Anda telah melampaui kuota permintaan API. Silakan coba lagi nanti.';
            }
        }
    }

    res.status(statusCode).json({ error: errorMessage });
  }
});
