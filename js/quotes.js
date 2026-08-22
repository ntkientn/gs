/* =========================================================
   HabitStreak — Quotes database
   ~50 original Vietnamese lines on persistence & discipline.
   Always shown in Vietnamese regardless of UI language,
   per product spec.
   ========================================================= */
const QUOTES_VI = [
  "Mỗi ngày kiên trì là một viên gạch xây nên phiên bản tốt hơn của chính mình.",
  "Thành công không đến từ một ngày phi thường, mà từ những ngày bình thường được lặp lại.",
  "Đừng đếm những ngày trôi qua, hãy làm cho những ngày đó đáng để đếm.",
  "Thói quen nhỏ hôm nay là nền móng cho thay đổi lớn ngày mai.",
  "Bạn không cần hoàn hảo, chỉ cần không bỏ cuộc.",
  "Kỷ luật là cây cầu nối giữa mục tiêu và thành quả.",
  "Chuỗi ngày dài nhất luôn bắt đầu từ một ngày đầu tiên can đảm.",
  "Làm điều đúng mỗi ngày, dù nhỏ, rồi năm tháng sẽ trả lời thay bạn.",
  "Đừng để một ngày lỡ hẹn trở thành cái cớ để bỏ cả hành trình.",
  "Người kiên trì không phải là người không mệt, mà là người vẫn tiếp tục dù mệt.",
  "Mỗi lần bạn giữ lời hứa với chính mình, bạn đang xây dựng lòng tin ở bản thân.",
  "Tiến bộ chậm vẫn tốt hơn đứng yên tại chỗ.",
  "Không có phép màu, chỉ có sự lặp lại đủ lâu.",
  "Hãy trở thành người mà bạn muốn nhìn thấy vào cuối năm nay.",
  "Một thói quen tốt là món quà bạn tặng cho chính mình mỗi sáng thức dậy.",
  "Đường dài được đo bằng những bước chân nhỏ, không phải những cú nhảy vọt.",
  "Kỷ luật hôm nay là tự do ngày mai.",
  "Bạn sẽ không nhớ những ngày dễ dàng, bạn sẽ nhớ những ngày bạn không bỏ cuộc.",
  "Sự thay đổi thật sự luôn diễn ra trong âm thầm, ngày qua ngày.",
  "Đừng chờ cảm hứng, hãy tạo ra động lực bằng hành động.",
  "Một streak dài không phải là may mắn, đó là lựa chọn được lặp lại.",
  "Nếu hôm nay khó, hãy làm ít thôi, nhưng đừng làm số 0.",
  "Bền bỉ là tài năng của những người không muốn dừng lại.",
  "Ai cũng có thể bắt đầu, người thắng cuộc là người duy trì.",
  "Thành quả lớn nhất thường được gặt hái bởi những người kiên nhẫn nhất.",
  "Hãy tin vào tiến trình, dù kết quả chưa hiện rõ ngay hôm nay.",
  "Từng ngày nhỏ cộng lại chính là câu chuyện lớn của cuộc đời bạn.",
  "Không ai giỏi ngay từ đầu, chỉ có người không ngừng luyện tập.",
  "Cứ đi, con đường sẽ hiện ra dưới chân bạn.",
  "Hãy làm bạn với sự khó chịu ban đầu, phần thưởng nằm ở phía sau nó.",
  "Bạn của tương lai đang được quyết định bởi thói quen của hôm nay.",
  "Chỉ cần tốt hơn hôm qua một chút, đó đã là chiến thắng.",
  "Người mạnh mẽ không phải người không vấp ngã, mà là người đứng dậy đúng cách.",
  "Giữ lời hứa với bản thân là hình thức tôn trọng cao nhất dành cho chính mình.",
  "Thói quen là lãi kép của sự trưởng thành.",
  "Không có con đường tắt nào dẫn đến nơi đáng để đến.",
  "Một quyết tâm nhỏ được lặp lại còn mạnh hơn một quyết tâm lớn chỉ nói một lần.",
  "Bạn không thua vì chậm, bạn chỉ thua khi ngừng bước.",
  "Hãy để hôm nay là bằng chứng cho việc bạn nghiêm túc với ước mơ của mình.",
  "Mỗi ô vuông được tô màu trên lịch là một lời hứa bạn đã giữ.",
  "Kiên trì biến những điều không thể thành chuyện đương nhiên.",
  "Đừng so sánh ngày 1 của bạn với ngày 100 của người khác.",
  "Cách tốt nhất để dự đoán tương lai là tự tay xây dựng nó, từng ngày một.",
  "Chăm chỉ âm thầm rồi để kết quả lên tiếng.",
  "Bạn không cần động lực mỗi ngày, bạn chỉ cần một hệ thống thói quen vững vàng.",
  "Người phi thường chỉ đơn giản là người bình thường không bỏ cuộc.",
  "Một bước nhỏ hôm nay tốt hơn một kế hoạch hoàn hảo mãi chưa bắt đầu.",
  "Càng khó duy trì, phần thưởng phía sau càng xứng đáng.",
  "Hãy để sự kiên trì trở thành thứ khiến bạn nổi bật.",
  "Ngày hôm nay là cơ hội để tiếp nối những gì bạn đã bắt đầu.",
  "Không cần phải nhanh, chỉ cần đừng dừng lại."
];

function getRandomQuote(){
  return QUOTES_VI[Math.floor(Math.random() * QUOTES_VI.length)];
}
