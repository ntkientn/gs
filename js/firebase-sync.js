import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 1. CẤU HÌNH FIREBASE 
const firebaseConfig = {
    apiKey: "AIzaSyC47Y6noCQW7VbXoMPiHKbBwRJMCMbJXFA",
    authDomain: "goal-streak-888.firebaseapp.com",
    projectId: "goal-streak-888",
    storageBucket: "goal-streak-888.firebasestorage.app",
    messagingSenderId: "1007243115113",
    appId: "1:1007243115113:web:26294fba6108f2b06a00f8",
    measurementId: "G-7KKLHK840S"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

window.firebaseUser = null;

// 2. LẮNG NGHE TRẠNG THÁI ĐĂNG NHẬP
onAuthStateChanged(auth, async (user) => {
  window.firebaseUser = user;
  const loginBtn = document.getElementById('loginBtn');
  const userProfile = document.getElementById('userProfile');
  
  if (user) {
    // Đã login -> Hiện avatar, ẩn nút login
    loginBtn.style.display = 'none';
    userProfile.style.display = 'flex';
    document.getElementById('userAvatar').src = user.photoURL;
    
    // Tiến hành kéo và gộp data
    await syncDataFromFirebase(user.uid);
  } else {
    // Chưa login -> Hiện nút login
    loginBtn.style.display = 'block';
    userProfile.style.display = 'none';
  }
});

// 3. LOGIC KÉO & MERGE DATA
async function syncDataFromFirebase(uid) {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const cloudState = docSnap.data();
      
      // Gọi hàm mergeStates từ storage.js (ưu tiên ghép ngày và lấy info mới nhất)
      STATE = mergeStates(STATE, cloudState);
      
      // Lưu kết quả gộp xuống Local Storage
      localStorage.setItem('goalstreak_v1', JSON.stringify(STATE));
      
      // Đẩy ngược bản Merge chuẩn nhất lên lại Firebase để 2 bên đồng bộ 100%
      await window.pushDataToFirebase();
      
      // Cập nhật lại giao diện UI
      if (typeof renderHabitList === 'function') renderHabitList();
      if (typeof refreshHeaderStats === 'function') refreshHeaderStats();
      if (typeof showToast === 'function') showToast("Đã đồng bộ dữ liệu ☁️");
    } else {
      // User mới tinh trên Firebase -> Backup local lên mây
      await window.pushDataToFirebase();
      if (typeof showToast === 'function') showToast("Đã sao lưu lên Cloud ☁️");
    }
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu Firebase:", error);
  }
}

// 4. LOGIC ĐẨY DATA LÊN (Được gọi ngầm từ hàm save() trong storage.js)
window.pushDataToFirebase = async () => {
  if (!window.firebaseUser) return; // Không làm gì nếu chưa login
  try {
    // Đẩy cục STATE hiện tại lên Firestore
    await setDoc(doc(db, "users", window.firebaseUser.uid), STATE);
  } catch (e) {
    console.error("Lỗi upload Firebase:", e);
  }
};

// 5. GẮN SỰ KIỆN CHO NÚT BẤM
document.getElementById('loginBtn').addEventListener('click', () => {
  signInWithPopup(auth, provider).catch(err => alert("Lỗi đăng nhập: " + err.message));
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  signOut(auth).then(() => {
    if (typeof showToast === 'function') showToast("Đã đăng xuất khỏi Cloud.");
  });
});

// Logic mở/đóng Drawer
const profileBtn = document.getElementById('profileMenuBtn');
const drawer = document.getElementById('profileDrawer');
const overlay = document.getElementById('drawerOverlay');
const closeBtn = document.getElementById('closeDrawerBtn');

function openDrawer() {
  overlay.style.display = 'block';
  setTimeout(() => drawer.style.right = '0', 10);
}

function closeDrawer() {
  drawer.style.right = '-300px';
  setTimeout(() => overlay.style.display = 'none', 300);
}

profileBtn.addEventListener('click', openDrawer);
closeBtn.addEventListener('click', closeDrawer);
overlay.addEventListener('click', closeDrawer);

// Cập nhật hàm onAuthStateChanged (thay thế phần cũ)
onAuthStateChanged(auth, async (user) => {
  window.firebaseUser = user;
  
  const offlineIcon = document.getElementById('offlineAvatarIcon');
  const onlineImg = document.getElementById('onlineAvatarImg');
  const offlineState = document.getElementById('drawerOfflineState');
  const onlineState = document.getElementById('drawerOnlineState');
  const nameDisplay = document.getElementById('userNameDisplay');
  
  if (user) {
    // 1. Logic xử lý Avatar Fallback
    // Nếu có photoURL thì dùng, không có thì gọi API tạo avatar chữ cái đầu
    let avatarUrl = user.photoURL;
    if (!avatarUrl) {
      // Lấy tên hoặc email, nếu không có gì thì dùng chữ "U" (User)
      const fallbackName = user.displayName || user.email || 'U';
      // Tạo avatar với nền cam san hô (FF5D3E) và chữ trắng
      avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=FF5D3E&color=fff&bold=true`;
    }

    // Top Bar
    offlineIcon.style.display = 'none';
    onlineImg.style.display = 'block';
    onlineImg.src = avatarUrl; // Gắn URL đã xử lý vào
    
    // Drawer
    offlineState.style.display = 'none';
    onlineState.style.display = 'block';
    nameDisplay.textContent = user.displayName || user.email || 'Người dùng'; // Fallback cho tên hiển thị
    
    await syncDataFromFirebase(user.uid);
  } else {
    // Top Bar
    offlineIcon.style.display = 'block';
    onlineImg.style.display = 'none';
    
    // Drawer
    offlineState.style.display = 'block';
    onlineState.style.display = 'none';
  }
});