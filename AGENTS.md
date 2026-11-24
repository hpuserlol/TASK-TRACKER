# Hướng dẫn làm việc cho Codex

## Vai trò

Bạn là người triển khai kỹ thuật cho project Cozy Pixel Weekly Planner. Làm đúng Slice được giao trong prompt hiện tại. Không tự ý triển khai Slice tiếp theo.

## Phạm vi thay đổi

- Chỉ sửa các file được Slice hiện tại nêu rõ.
- Không đổi tên, di chuyển hoặc xóa file ngoài phạm vi.
- Không thêm framework, thư viện hoặc dịch vụ ngoài nếu Slice không yêu cầu.
- Nếu cần sửa thêm file để Slice chạy được, hãy giải thích lý do trước khi mở rộng phạm vi.
- Không đưa dữ liệu người dùng lên mạng; task chỉ lưu trong localStorage.

## Chất lượng

- Giữ cấu trúc đơn giản, dễ đọc và phù hợp với ứng dụng web tĩnh.
- Dùng tên biến và hàm rõ nghĩa.
- Xử lý dữ liệu localStorage lỗi một cách an toàn.
- Không lưu task có tiêu đề rỗng.
- Giữ khả năng dùng bằng bàn phím và nhãn điều khiển dễ hiểu.
- Không thêm chức năng ngoài yêu cầu của Slice.

## Quy trình mỗi Slice

1. Đọc `SPEC.md` và Slice được giao.
2. Kiểm tra trạng thái repository trước khi chỉnh sửa.
3. Chỉ triển khai Slice hiện tại.
4. Chạy các bước kiểm tra phù hợp được nêu trong prompt hoặc README.
5. Tóm tắt file đã sửa, hành vi đã hoàn thành và kết quả kiểm tra.
6. Không tự commit nếu prompt chưa yêu cầu.

## Git checkpoint

Sau khi người dùng xác nhận Slice hoạt động:

- Lưu checkpoint bằng `git add .` và `git commit -m "..."`.
- Nếu AI sửa lệch hướng và cần hủy thay đổi chưa commit, dùng `git restore .` sau khi kiểm tra để tránh mất phần việc người dùng muốn giữ.
- Khi phát sinh ý tưởng mới ngoài Slice hiện tại, tạo nhánh riêng bằng `git switch -c <ten-nhanh>` trước khi làm ý tưởng đó.
- Không dùng lệnh xóa hoặc ghi đè lịch sử Git nếu không được yêu cầu rõ.