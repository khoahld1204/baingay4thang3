const express = require('express');
const app = express();
const port = 3000;

// Middleware để parse dữ liệu JSON từ body của request
app.use(express.json());

// --- DỮ LIỆU GIẢ LẬP ---
let dataRole = [
  { "id": "r1", "name": "Quản trị viên", "description": "Toàn quyền quản lý hệ thống", "creationAt": "2026-03-04T08:00:00.000Z", "updatedAt": "2026-03-04T08:00:00.000Z" },
  { "id": "r2", "name": "Biên tập viên", "description": "Quản lý nội dung và dữ liệu", "creationAt": "2026-03-04T08:00:00.000Z", "updatedAt": "2026-03-04T08:00:00.000Z" },
  { "id": "r3", "name": "Người dùng", "description": "Tài khoản người dùng thông thường", "creationAt": "2026-03-04T08:00:00.000Z", "updatedAt": "2026-03-04T08:00:00.000Z" }
];

let dataUser = [
  // Lấy 3 user làm ví dụ cho gọn, bạn có thể copy toàn bộ dataUser của bạn vào đây
  { "username": "nguyenvana", "password": "123456", "email": "vana@gmail.com", "fullName": "Nguyễn Văn A", "status": true, "loginCount": 15, "role": { "id": "r1", "name": "Quản trị viên" } },
  { "username": "tranthib", "password": "123456", "email": "thib@gmail.com", "fullName": "Trần Thị B", "status": true, "loginCount": 7, "role": { "id": "r2", "name": "Biên tập viên" } },
  { "username": "levanc", "password": "123456", "email": "vanc@gmail.com", "fullName": "Lê Văn C", "status": true, "loginCount": 3, "role": { "id": "r3", "name": "Người dùng" } }
];

// ==========================================
// 1. CRUD CHO ROLES
// ==========================================

// READ: Lấy danh sách tất cả roles
app.get('/roles', (req, res) => res.json(dataRole));

// READ: Lấy 1 role theo id
app.get('/roles/:id', (req, res) => {
    const role = dataRole.find(r => r.id === req.params.id);
    if (!role) return res.status(404).json({ message: "Không tìm thấy Role" });
    res.json(role);
});

// CREATE: Thêm role mới
app.post('/roles', (req, res) => {
    const newRole = { ...req.body, creationAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    dataRole.push(newRole);
    res.status(201).json(newRole);
});

// UPDATE: Cập nhật role
app.put('/roles/:id', (req, res) => {
    const index = dataRole.findIndex(r => r.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: "Không tìm thấy Role" });
    
    dataRole[index] = { ...dataRole[index], ...req.body, updatedAt: new Date().toISOString() };
    res.json(dataRole[index]);
});

// DELETE: Xóa role
app.delete('/roles/:id', (req, res) => {
    dataRole = dataRole.filter(r => r.id !== req.params.id);
    res.json({ message: "Đã xóa role thành công" });
});

// ==========================================
// 2. CRUD CHO USERS (Sử dụng username làm ID)
// ==========================================

// READ: Lấy tất cả user
app.get('/users', (req, res) => res.json(dataUser));

// READ: Lấy 1 user theo username
app.get('/users/:username', (req, res) => {
    const user = dataUser.find(u => u.username === req.params.username);
    if (!user) return res.status(404).json({ message: "Không tìm thấy User" });
    res.json(user);
});

// CREATE: Thêm user mới
app.post('/users', (req, res) => {
    const newUser = { ...req.body, creationAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    dataUser.push(newUser);
    res.status(201).json(newUser);
});

// UPDATE: Cập nhật user
app.put('/users/:username', (req, res) => {
    const index = dataUser.findIndex(u => u.username === req.params.username);
    if (index === -1) return res.status(404).json({ message: "Không tìm thấy User" });
    
    dataUser[index] = { ...dataUser[index], ...req.body, updatedAt: new Date().toISOString() };
    res.json(dataUser[index]);
});

// DELETE: Xóa user
app.delete('/users/:username', (req, res) => {
    dataUser = dataUser.filter(u => u.username !== req.params.username);
    res.json({ message: "Đã xóa user thành công" });
});

// ==========================================
// 3. CUSTOM REQUEST: Lấy danh sách user theo Role ID
// ==========================================
app.get('/roles/:id/users', (req, res) => {
    const roleId = req.params.id;
    
    // Kiểm tra xem role có tồn tại không (tùy chọn nhưng nên có)
    const roleExists = dataRole.find(r => r.id === roleId);
    if (!roleExists) return res.status(404).json({ message: "Role không tồn tại" });

    // Lọc ra các user có role.id trùng với id truyền vào
    const usersInRole = dataUser.filter(user => user.role && user.role.id === roleId);
    
    res.json(usersInRole);
});

// Khởi động server
app.listen(port, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${port}`);
});