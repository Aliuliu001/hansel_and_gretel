# 📌 CONTEXT RESUME GUIDE (Dùng khi /new để khôi phục nhanh ngữ cảnh)

Nếu hội thoại bị làm mới (`/new`), anh chỉ cần nói:
> **"Đọc file `context-resume.md` trong thư mục `hansel-gretel-escape` rồi tiếp tục công việc."**

## 1. Thông tin dự án
- **Tên app:** Hansel & Gretel: Candy House Escape (Game giải đố giáo dục).
- **Repo GitHub:** `Aliuliu001/hansel_and_gretel`
- **Link Online (GitHub Pages):** https://aliuliu001.github.io/hansel_and_gretel/
- **Thư mục source local:** `/home/ubuntu/hansel-gretel-escape`

## 2. Các tính năng cốt lõi (v2.0 đang làm)
1. **3 Chế độ chơi:**
   - **Mode 1 (Classic):** Nhập số trực tiếp (1 đến 10 chữ số).
   - **Mode 2 (Math):** Hiện phép tính số học (vd: `68 - 24 = ?`), học sinh gõ đáp án.
   - **Mode 3 (Math in English):** Phép tính bằng tiếng Anh (vd: `Twenty-five plus twelve equals ?`), học sinh gõ đáp án số.
2. **Endless Rounds (1 đến 200 vòng):** Cài đặt số vòng trong Setting.
3. **Teacher Paste Format (Cú pháp dán dữ liệu cho giáo viên):**
   - Giáo viên paste danh sách vào ô cài đặt theo định dạng:
     `Phép tính / Câu hỏi = Đáp án` (đáp án cuối cùng chính là mã mở khóa).
     Ví dụ:
     ```text
     2 + 5 = 7
     9 - 3 = 6
     Three plus five equals ? 8
     ```

## 3. Các file quan trọng
- `plan.md`: Kế hoạch chi tiết.
- `tasks.md`: Danh sách task đang làm.
- `src/types/game.ts`: Định nghĩa kiểu dữ liệu game v2.
- `src/components/TeacherSettingsModal.tsx`: Giao diện cài đặt cho giáo viên (có hướng dẫn paste).
- `src/components/CombinationLock.tsx`: Ổ khóa co giãn 1–10 ô số.
- `src/components/GamePlayView.tsx`: Logic trò chơi đa vòng & giải toán.
