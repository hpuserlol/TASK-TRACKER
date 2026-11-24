# Cozy Pixel Weekly Planner — Specification

## 1. Mục tiêu

Tạo ứng dụng web cá nhân để xem lịch tuần, sắp xếp task theo ngày và theo dõi việc đã hoàn thành. Ứng dụng chạy trên trình duyệt, lưu dữ liệu trên thiết bị và có thể phát hành qua GitHub Pages.

## 2. Đối tượng và nền tảng

- Người dùng: một cá nhân.
- Thiết bị ưu tiên: máy tính Windows, màn hình desktop và laptop.
- Trình duyệt: phiên bản hiện đại của Chrome, Edge hoặc Firefox.
- Hosting: GitHub Pages.
- Không cần tài khoản đăng nhập trong ứng dụng.
- Dữ liệu lưu riêng trên trình duyệt bằng `localStorage`; không đồng bộ giữa thiết bị.

## 3. Phạm vi MVP

1. Xem các ngày trong tuần hiện tại và chuyển sang tuần trước/tuần sau.
2. Chọn một ngày để xem các task của ngày đó.
3. Thêm task với tiêu đề, ngày và giờ tùy chọn.
4. Đánh dấu task hoàn thành hoặc chưa hoàn thành.
5. Tự động lưu task trên trình duyệt.
6. Hiển thị giao diện pixel art có cảm giác cozy, nostalgic, vintage và dreamy.

## 4. Luồng sử dụng chính

1. Người dùng mở ứng dụng và thấy tuần hiện tại.
2. Người dùng chọn một ngày trong tuần.
3. Người dùng tạo task và nhập tiêu đề; ngày được chọn sẵn theo ngày đang xem.
4. Người dùng có thể đặt giờ hoặc để trống.
5. Task xuất hiện trong danh sách của ngày đó.
6. Người dùng đánh dấu task hoàn thành khi xong.
7. Khi mở lại trang trên cùng trình duyệt, task vẫn còn.

## 5. Quy tắc dữ liệu và hành vi

### Task

Mỗi task gồm:

- `id`: mã định danh duy nhất.
- `title`: tiêu đề đã được trim khoảng trắng đầu/cuối; không cho lưu tiêu đề rỗng.
- `date`: ngày theo định dạng `YYYY-MM-DD`.
- `time`: giờ dạng `HH:mm` hoặc rỗng.
- `completed`: trạng thái hoàn thành dạng boolean.
- `createdAt`: thời điểm tạo theo ISO 8601.

### Sắp xếp và hiển thị

- Task có giờ hiển thị theo giờ tăng dần.
- Task không có giờ hiển thị sau các task có giờ.
- Nếu cùng giờ hoặc cùng không có giờ, giữ thứ tự tạo.
- Ngày không có task hiển thị trạng thái trống thân thiện và lời nhắc thêm task.
- Task hoàn thành vẫn hiển thị trong danh sách, với kiểu trình bày phân biệt.

### Lưu trữ

- Dùng một khóa localStorage có phiên bản, ví dụ `cozy-planner-v1`.
- Mỗi lần thêm task hoặc đổi trạng thái hoàn thành, lưu dữ liệu ngay.
- Khi dữ liệu lưu bị lỗi hoặc không đọc được, ứng dụng không được sập; hiển thị trạng thái phù hợp và cho phép tiếp tục sử dụng.
- Không gửi dữ liệu task lên máy chủ.

## 6. Giao diện

### Phong cách

- Pixel art nhẹ nhàng, dễ đọc và không gây rối.
- Bảng màu gợi ý: giấy kem, nâu ấm, xanh rêu, hồng bụi và điểm nhấn vàng nhạt.
- Khung và chi tiết có cảm giác sổ tay/lịch vintage.
- Trang trí vừa phải bằng họa tiết pixel như sao, hoa hoặc ánh đèn.
- Chữ nội dung phải dễ đọc; không dùng font pixel cho đoạn văn dài nếu làm giảm khả năng đọc.

### Bố cục

- Phần đầu trang: tên ứng dụng và tuần đang xem.
- Điều khiển tuần: nút tuần trước, tuần sau và nút quay về tuần hiện tại.
- Thanh ngày trong tuần: hiển thị 7 ngày, ngày được chọn có trạng thái nổi bật.
- Khu vực nội dung: danh sách task của ngày được chọn.
- Khu vực thêm task: trường tiêu đề, trường giờ tùy chọn và nút thêm.
- Mỗi task có điều khiển đánh dấu hoàn thành.

### Khả năng sử dụng

- Các nút có nhãn hoặc trạng thái dễ hiểu.
- Có thể dùng bằng bàn phím ở mức cơ bản.
- Màu chữ và nền cần đủ tương phản.
- Bố cục co lại hợp lý trên màn hình nhỏ.

## 7. Tuần và ngày

- Tuần bắt đầu vào thứ Hai.
- Tuần hiện tại được xác định theo ngày địa phương trên thiết bị.
- Khi chuyển tuần, vẫn chọn ngày tương ứng nếu có thể; nếu không, chọn thứ Hai của tuần đang xem.
- Nút “Hôm nay” đưa lịch về tuần có ngày hiện tại và chọn ngày hiện tại.

## 8. Cấu trúc thư mục đề xuất

- `index.html`: khung trang và các vùng giao diện.
- `styles.css`: bố cục, màu sắc, typography và trạng thái giao diện.
- `app.js`: điều hướng tuần, chọn ngày, quản lý task và lưu trữ.
- `assets/`: hình ảnh hoặc tài nguyên pixel art nếu thực sự cần.
- `README.md`: mô tả project và cách chạy/phát hành.

Không thêm framework hoặc thư viện ngoài nếu MVP chưa có nhu cầu rõ ràng.

## 9. Ngoài phạm vi MVP

- Đăng nhập và đồng bộ đám mây.
- Chia sẻ lịch hoặc cộng tác.
- Lặp task, nhắc giờ hoặc thông báo.
- Kéo thả task.
- Nhiều lịch hoặc nhiều tài khoản.
- Tên miền riêng.

## 10. Phát hành

- Mã nguồn được lưu trong repository GitHub.
- Bật GitHub Pages cho nhánh và thư mục phát hành đã chọn.
- Ứng dụng phải dùng đường dẫn tương đối phù hợp với đường dẫn project trên GitHub Pages.
- Sau khi phát hành, kiểm tra trang mở được và các chức năng chính hoạt động.

## 11. Tiêu chí hoàn thành MVP

- Người dùng xem được tuần hiện tại, tuần trước và tuần sau.
- Người dùng chọn được một ngày và chỉ xem task của ngày đó.
- Người dùng tạo được task với tiêu đề bắt buộc và giờ tùy chọn.
- Người dùng đánh dấu hoàn thành/bỏ hoàn thành được.
- Task được lưu sau khi tải lại trang trên cùng trình duyệt.
- Ứng dụng hoạt động khi được host ở đường dẫn GitHub Pages của repository.
- Giao diện phù hợp phong cách đã chốt và dùng được trên desktop lẫn màn hình nhỏ.