// Comprehensive car diagnostic data with hierarchical structure - Updated from real CSV data

export interface SymptomGroup {
  id: string
  name: string
  detailSymptoms: string[]
  repairs: string[]
}

export interface SubCategory {
  id: string
  name: string
  issues: string[]
  repairs: string[]
  symptomGroups: SymptomGroup[]
}

export interface DiagnosticCategory {
  id: string
  name: string
  issues: string[]
  repairs: string[]
  subCategories: SubCategory[]
}

export const diagnosticCategories: DiagnosticCategory[] = [
  {
    id: "than_vo_xe",
    name: "Thân vỏ xe",
    issues: [
      "Chỉ còi xe thấp",
      "Còi xe không hoạt động",
      "Tiếng còi bị méo",
      "Còi xe kêu liên tục",
      "Đèn pha không sáng",
      "Đèn pha sáng yếu",
      "Đèn pha chớp tắt",
      "Đèn hậu không hoạt động",
      "Đèn xi nhan không nhấp nháy",
      "Đèn báo nguy hiểm không hoạt động",
      "Cửa sổ điện không hoạt động",
      "Cửa sổ điện chạy chậm",
      "Cửa sổ điện bị kẹt",
      "Khóa cửa điện không hoạt động",
      "Gương chiếu hậu điện không điều chỉnh được",
      "Antenna radio không hoạt động",
      "Hệ thống âm thanh không có tiếng",
      "Loa bị rè",
      "Radio không bắt được sóng",
      "Bluetooth không kết nối được",
      "Màn hình hiển thị bị mờ",
      "Màn hình cảm ứng không phản hồi",
      "Camera lùi không hiển thị",
      "Cảm biến đỗ xe không hoạt động",
      "Vết xước trên sơn",
      "Móp méo thân xe",
      "Rỉ sét trên thân xe",
      "Cửa xe không đóng khít",
      "Kính xe bị nứt",
      "Gương chiếu hậu bị vỡ",
      "Cản xe bị hỏng",
      "Nắp capo không đóng chặt",
      "Cốp xe không mở được",
    ],
    repairs: [
      "Thay còi xe",
      "Sửa chữa mạch điện còi",
      "Thay bóng đèn pha",
      "Sửa chữa hệ thống đèn",
      "Thay đèn hậu",
      "Sửa chữa đèn xi nhan",
      "Thay motor cửa sổ",
      "Sửa chữa hệ thống khóa cửa",
      "Thay gương chiếu hậu",
      "Sửa chữa antenna",
      "Thay loa âm thanh",
      "Sửa chữa radio",
      "Cài đặt Bluetooth",
      "Thay màn hình hiển thị",
      "Sửa chữa camera lùi",
      "Thay cảm biến đỗ xe",
      "Sơn phục hồi",
      "Sửa chữa móp méo",
      "Xử lý rỉ sét",
      "Điều chỉnh cửa xe",
      "Thay kính xe",
      "Sửa chữa cản xe",
      "Điều chỉnh nắp capo",
      "Sửa chữa cốp xe",
    ],
    subCategories: [
      {
        id: "coi_xe",
        name: "Còi xe",
        issues: ["Chỉ còi xe thấp", "Còi xe không hoạt động", "Tiếng còi bị méo", "Còi xe kêu liên tục"],
        repairs: ["Thay còi xe", "Sửa chữa mạch điện còi", "Điều chỉnh âm lượng còi", "Thay relay còi"],
        symptomGroups: [
          {
            id: "chi_coi_xe_thap",
            name: "Chỉ còi xe thấp",
            detailSymptoms: [
              "Còi xe có tiếng nhưng rất nhỏ",
              "Còi xe chỉ kêu được một phần",
              "Còi xe âm thanh không rõ ràng",
            ],
            repairs: ["Điều chỉnh âm lượng còi", "Thay loa còi", "Sửa chữa mạch khuếch đại"],
          },
          {
            id: "coi_xe_khong_hoat_dong",
            name: "Còi xe không hoạt động",
            detailSymptoms: [
              "Nhấn còi không có tiếng",
              "Còi xe hoàn toàn im lặng",
              "Không có phản ứng khi nhấn nút còi",
            ],
            repairs: ["Thay còi xe", "Sửa chữa mạch điện còi", "Thay cầu chì còi"],
          },
        ],
      },
      {
        id: "he_thong_den",
        name: "Hệ thống đèn",
        issues: [
          "Đèn pha không sáng",
          "Đèn pha sáng yếu",
          "Đèn pha chớp tắt",
          "Đèn hậu không hoạt động",
          "Đèn xi nhan không nhấp nháy",
          "Đèn báo nguy hiểm không hoạt động",
        ],
        repairs: [
          "Thay bóng đèn pha",
          "Sửa chữa hệ thống đèn",
          "Thay đèn hậu",
          "Sửa chữa đèn xi nhan",
          "Thay relay đèn",
          "Sửa chữa mạch điện đèn",
        ],
        symptomGroups: [
          {
            id: "den_pha_khong_sang",
            name: "Đèn pha không sáng",
            detailSymptoms: ["Một bên đèn pha không sáng", "Cả hai đèn pha không sáng", "Đèn pha không sáng khi bật"],
            repairs: ["Thay bóng đèn pha", "Sửa chữa mạch điện đèn pha", "Thay cầu chì đèn pha"],
          },
          {
            id: "den_xi_nhan_khong_nhap_nhay",
            name: "Đèn xi nhan không nhấp nháy",
            detailSymptoms: [
              "Đèn xi nhan sáng liên tục",
              "Đèn xi nhan không sáng",
              "Đèn xi nhan nhấp nháy quá nhanh",
              "Đèn xi nhan nhấp nháy quá chậm",
            ],
            repairs: ["Thay bóng đèn xi nhan", "Thay relay xi nhan", "Sửa chữa mạch xi nhan"],
          },
        ],
      },
      {
        id: "cua_so_dien",
        name: "Cửa sổ điện",
        issues: ["Cửa sổ điện không hoạt động", "Cửa sổ điện chạy chậm", "Cửa sổ điện bị kẹt"],
        repairs: ["Thay motor cửa sổ", "Sửa chữa mạch điện cửa sổ", "Thay công tắc cửa sổ", "Bôi trơn ray cửa sổ"],
        symptomGroups: [
          {
            id: "cua_so_dien_khong_hoat_dong",
            name: "Cửa sổ điện không hoạt động",
            detailSymptoms: [
              "Nhấn nút cửa sổ không có phản ứng",
              "Cửa sổ không lên xuống được",
              "Motor cửa sổ không chạy",
            ],
            repairs: ["Thay motor cửa sổ", "Sửa chữa mạch điện", "Thay công tắc cửa sổ"],
          },
          {
            id: "cua_so_dien_chay_cham",
            name: "Cửa sổ điện chạy chậm",
            detailSymptoms: ["Cửa sổ lên xuống rất chậm", "Motor cửa sổ chạy yếu", "Cửa sổ bị nghẹt khi chạy"],
            repairs: ["Bôi trơn ray cửa sổ", "Thay motor cửa sổ", "Kiểm tra nguồn điện"],
          },
        ],
      },
    ],
  },
  {
    id: "dong_co",
    name: "Động cơ",
    issues: [
      "Động cơ khó khởi động",
      "Động cơ không khởi động được",
      "Động cơ nổ bất thường",
      "Động cơ rung lắc khi chạy",
      "Tiếng gõ trong động cơ",
      "Động cơ quá nóng",
      "Khói đen từ ống xả",
      "Khói trắng từ ống xả",
      "Khói xanh từ ống xả",
      "Công suất động cơ giảm",
      "Tiêu thụ nhiên liệu tăng",
      "Động cơ tắt máy đột ngột",
      "Âm thanh bất thường từ động cơ",
      "Động cơ chạy không ổn định",
      "Tăng tốc kém",
      "Động cơ giật cục",
      "Nhiệt độ động cơ cao",
      "Áp suất dầu thấp",
      "Đèn báo động cơ sáng",
      "Rò rỉ dầu động cơ",
      "Rò rỉ nước làm mát",
      "Quạt làm mát không hoạt động",
      "Thermostat bị kẹt",
      "Bơm nước hỏng",
    ],
    repairs: [
      "Thay bugi",
      "Thay dây bugi",
      "Vệ sinh kim phun",
      "Thay lọc nhiên liệu",
      "Thay dầu động cơ",
      "Thay lọc dầu",
      "Sửa chữa hệ thống đánh lửa",
      "Thay gasket nắp máy",
      "Sửa chữa hệ thống phun nhiên liệu",
      "Thay timing belt",
      "Sửa chữa hệ thống làm mát",
      "Thay thermostat",
      "Thay bơm nước",
      "Thay quạt làm mát",
      "Sửa chữa đường ống nước",
      "Vệ sinh hệ thống làm mát",
      "Thay nắp két nước",
      "Sửa chữa hệ thống xả",
      "Thay catalytic converter",
      "Điều chỉnh van khí",
      "Thay piston",
      "Sửa chữa cylinder head",
      "Thay oil seal",
      "Cân chỉnh động cơ",
    ],
    subCategories: [
      {
        id: "he_thong_khoi_dong",
        name: "Hệ thống khởi động",
        issues: ["Động cơ khó khởi động", "Động cơ không khởi động được", "Động cơ khởi động chậm"],
        repairs: [
          "Thay bugi",
          "Thay ắc quy",
          "Sửa chữa hệ thống đánh lửa",
          "Thay starter",
          "Kiểm tra hệ thống nhiên liệu",
        ],
        symptomGroups: [
          {
            id: "dong_co_kho_khoi_dong",
            name: "Động cơ khó khởi động",
            detailSymptoms: [
              "Động cơ cần quay nhiều vòng mới nổ",
              "Khởi động lâu trong thời tiết lạnh",
              "Cần đạp ga khi khởi động",
            ],
            repairs: ["Thay bugi", "Vệ sinh kim phun", "Kiểm tra ắc quy"],
          },
          {
            id: "dong_co_khong_khoi_dong_duoc",
            name: "Động cơ không khởi động được",
            detailSymptoms: [
              "Động cơ không có phản ứng khi khởi động",
              "Starter không quay",
              "Có tiếng nhưng động cơ không nổ",
            ],
            repairs: ["Thay ắc quy", "Sửa chữa starter", "Kiểm tra hệ thống đánh lửa"],
          },
        ],
      },
      {
        id: "he_thong_lam_mat",
        name: "Hệ thống làm mát",
        issues: [
          "Động cơ quá nóng",
          "Rò rỉ nước làm mát",
          "Quạt làm mát không hoạt động",
          "Thermostat bị kẹt",
          "Bơm nước hỏng",
        ],
        repairs: [
          "Thay nước làm mát",
          "Thay thermostat",
          "Sửa chữa két nước",
          "Thay bơm nước",
          "Thay quạt làm mát",
          "Sửa chữa đường ống nước",
          "Vệ sinh hệ thống làm mát",
        ],
        symptomGroups: [
          {
            id: "dong_co_qua_nong",
            name: "Động cơ quá nóng",
            detailSymptoms: ["Đồng hồ nhiệt độ vào vùng đỏ", "Có hơi nước từ động cơ", "Động cơ tự tắt vì quá nóng"],
            repairs: ["Thay nước làm mát", "Kiểm tra quạt làm mát", "Thay thermostat"],
          },
          {
            id: "ro_ri_nuoc_lam_mat",
            name: "Rò rỉ nước làm mát",
            detailSymptoms: ["Thấy vệt nước dưới xe", "Mức nước làm mát giảm nhanh", "Có mùi nước làm mát trong xe"],
            repairs: ["Sửa chữa đường ống nước", "Thay gasket", "Sửa chữa két nước"],
          },
        ],
      },
    ],
  },
  {
    id: "he_thong_phanh",
    name: "Hệ thống phanh",
    issues: [
      "Phanh kém hiệu quả",
      "Tiếng kêu khi phanh",
      "Bàn đạp phanh mềm",
      "Bàn đạp phanh cứng",
      "Xe kéo lệch khi phanh",
      "Đèn báo phanh sáng",
      "Rung lắc khi phanh",
      "Phanh bị kẹt",
      "Dầu phanh bị rò rỉ",
      "Phanh tay không hiệu quả",
      "Bàn đạp phanh xuống sàn",
      "Phanh không nhả",
      "Má phanh mòn",
      "Đĩa phanh bị cong",
      "Tang trống phanh mòn",
      "Bơm phanh hỏng",
      "Cylinder phanh rò rỉ",
      "Ống dẫn phanh bị vỡ",
      "Phanh ABS không hoạt động",
      "Cảm biến phanh hỏng",
    ],
    repairs: [
      "Thay má phanh trước",
      "Thay má phanh sau",
      "Thay đĩa phanh",
      "Thay tang trống phanh",
      "Thay dầu phanh",
      "Sửa chữa cylinder phanh",
      "Thay ống dẫn phanh",
      "Điều chỉnh phanh tay",
      "Thay bơm phanh chính",
      "Vệ sinh hệ thống phanh",
      "Thay cảm biến phanh",
      "Sửa chữa hệ thống ABS",
      "Thay booster phanh",
      "Điều chỉnh khoảng cách phanh",
      "Thay dây phanh tay",
      "Sửa chữa van điều áp",
      "Thay má phanh ceramic",
      "Cân chỉnh hệ thống phanh",
      "Thay fluid reservoir",
      "Kiểm tra và bảo dưỡng phanh",
    ],
    subCategories: [
      {
        id: "phanh_dia",
        name: "Phanh đĩa",
        issues: ["Má phanh mòn", "Đĩa phanh bị cong", "Tiếng kêu khi phanh", "Rung lắc khi phanh"],
        repairs: ["Thay má phanh", "Thay đĩa phanh", "Mài đĩa phanh", "Thay caliper phanh"],
        symptomGroups: [
          {
            id: "ma_phanh_mon",
            name: "Má phanh mòn",
            detailSymptoms: [
              "Tiếng kêu cót két khi phanh",
              "Bàn đạp phanh sâu hơn bình thường",
              "Khoảng cách phanh tăng",
            ],
            repairs: ["Thay má phanh trước", "Thay má phanh sau", "Kiểm tra đĩa phanh"],
          },
          {
            id: "dia_phanh_bi_cong",
            name: "Đĩa phanh bị cong",
            detailSymptoms: ["Rung lắc vô lăng khi phanh", "Phanh không đều", "Bàn đạp phanh rung"],
            repairs: ["Thay đĩa phanh", "Mài đĩa phanh", "Cân chỉnh caliper"],
          },
        ],
      },
      {
        id: "phanh_trong",
        name: "Phanh trống",
        issues: ["Tang trống phanh mòn", "Trống phanh bị oval", "Phanh tay không hiệu quả"],
        repairs: ["Thay tang phanh", "Mài trống phanh", "Điều chỉnh phanh tay", "Thay dây phanh tay"],
        symptomGroups: [
          {
            id: "tang_trong_phanh_mon",
            name: "Tang trống phanh mòn",
            detailSymptoms: ["Phanh tay không giữ được xe", "Cần kéo phanh tay cao", "Tiếng ma sát khi phanh"],
            repairs: ["Thay tang phanh sau", "Điều chỉnh phanh tay", "Mài trống phanh"],
          },
        ],
      },
    ],
  },
  {
    id: "he_thong_truyen_dong",
    name: "Hệ thống truyền động",
    issues: [
      "Hộp số cứng",
      "Tiếng ồn từ hộp số",
      "Trượt số",
      "Khó vào số",
      "Rò rỉ dầu hộp số",
      "Ly hợp trượt",
      "Bàn đạp ly hợp nặng",
      "Tiếng kêu khi nhả ly hợp",
      "Xe giật khi chuyển số",
      "Hộp số tự động không chuyển số",
      "Hộp số tự động chuyển số muộn",
      "Hộp số tự động chuyển số sớm",
      "Dây cáp chuyển số đứt",
      "Trục cardan rung",
      "Khớp nối CV bị hỏng",
      "Dầu hộp số bị cháy",
      "Bộ ly hợp mòn",
      "Đĩa ly hợp cong",
      "Bạc đạn ly hợp hỏng",
      "Hộp số không vào số lùi",
    ],
    repairs: [
      "Thay dầu hộp số",
      "Sửa chữa ly hợp",
      "Thay đĩa ly hợp",
      "Thay bạc đạn ly hợp",
      "Sửa chữa hộp số tự động",
      "Thay dây cáp chuyển số",
      "Điều chỉnh ly hợp",
      "Thay oil seal hộp số",
      "Sửa chữa trục cardan",
      "Thay khớp nối CV",
      "Sửa chữa hộp số sàn",
      "Thay bộ đồng hồ hộp số",
      "Điều chỉnh cần số",
      "Thay filter hộp số tự động",
      "Sửa chữa van điều khiển",
      "Thay torque converter",
      "Cân chỉnh hộp số",
      "Thay clutch master cylinder",
      "Sửa chữa differential",
      "Bảo dưỡng hệ thống truyền động",
    ],
    subCategories: [
      {
        id: "ly_hop",
        name: "Ly hợp",
        issues: ["Ly hợp trượt", "Bàn đạp ly hợp nặng", "Tiếng kêu khi nhả ly hợp", "Ly hợp không nhả hoàn toàn"],
        repairs: ["Thay đĩa ly hợp", "Thay bạc đạn ly hợp", "Điều chỉnh ly hợp", "Thay master cylinder ly hợp"],
        symptomGroups: [
          {
            id: "ly_hop_truot",
            name: "Ly hợp trượt",
            detailSymptoms: [
              "Xe không tăng tốc dù tăng ga",
              "Vòng tua máy cao nhưng xe chạy chậm",
              "Mùi cháy từ ly hợp",
            ],
            repairs: ["Thay đĩa ly hợp", "Thay pressure plate", "Điều chỉnh ly hợp"],
          },
          {
            id: "ban_dap_ly_hop_nang",
            name: "Bàn đạp ly hợp nặng",
            detailSymptoms: [
              "Cần dùng nhiều lực để đạp ly hợp",
              "Chân mỏi khi lái trong thành phố",
              "Ly hợp không nhả hết",
            ],
            repairs: ["Thay master cylinder ly hợp", "Bôi trơn cơ cấu ly hợp", "Điều chỉnh dây ly hợp"],
          },
        ],
      },
      {
        id: "hop_so_san",
        name: "Hộp số sàn",
        issues: ["Hộp số cứng", "Khó vào số", "Tiếng ồn từ hộp số", "Trượt số", "Hộp số không vào số lùi"],
        repairs: [
          "Thay dầu hộp số",
          "Sửa chữa hộp số sàn",
          "Thay dây cáp chuyển số",
          "Điều chỉnh cần số",
          "Thay synchronizer",
        ],
        symptomGroups: [
          {
            id: "hop_so_cung",
            name: "Hộp số cứng",
            detailSymptoms: [
              "Khó chuyển số khi xe đang chạy",
              "Phải dùng lực mạnh để chuyển số",
              "Có tiếng ken kẹt khi chuyển số",
            ],
            repairs: ["Thay dầu hộp số", "Điều chỉnh ly hợp", "Sửa chữa synchronizer"],
          },
          {
            id: "kho_vao_so",
            name: "Khó vào số",
            detailSymptoms: [
              "Không vào được số 1 khi đứng yên",
              "Có tiếng kêu khi chuyển số",
              "Phải chuyển về N rồi mới vào số được",
            ],
            repairs: ["Điều chỉnh ly hợp", "Thay dây cáp chuyển số", "Sửa chữa hộp số"],
          },
        ],
      },
    ],
  },
  {
    id: "he_thong_treo_lai",
    name: "Hệ thống treo & lái",
    issues: [
      "Xe lắc lư khi chạy",
      "Tiếng kêu từ hệ thống treo",
      "Lái nặng",
      "Lái lỏng",
      "Xe kéo lệch",
      "Rung lắc ở vô lăng",
      "Tiếng kêu khi đánh lái",
      "Hệ thống treo quá mềm",
      "Hệ thống treo quá cứng",
      "Xe nghiêng khi vào cua",
      "Amortisseur bị rò rỉ",
      "Lò xo treo gãy",
      "Cao su cân bằng mòn",
      "Đầu lái lỏng",
      "Bi lái hỏng",
      "Góc đặt bánh xe sai",
      "Dầu trợ lực lái cạn",
      "Bơm trợ lực lái hỏng",
      "Thanh cân bằng gãy",
      "Bushings hỏng",
    ],
    repairs: [
      "Thay amortisseur trước",
      "Thay amortisseur sau",
      "Thay lò xo treo",
      "Thay cao su cân bằng",
      "Thay đầu lái",
      "Thay bi lái",
      "Cân chỉnh góc đặt bánh xe",
      "Thay dầu trợ lực lái",
      "Sửa chữa hệ thống trợ lực lái",
      "Thay thanh cân bằng",
      "Thay bushings",
      "Sửa chữa hệ thống treo khí",
      "Thay strut mount",
      "Điều chỉnh độ cao xe",
      "Thay tie rod",
      "Sửa chữa rack lái",
      "Thay ball joint",
      "Cân chỉnh camber",
      "Cân chỉnh toe",
      "Bảo dưỡng hệ thống lái",
    ],
    subCategories: [
      {
        id: "he_thong_treo",
        name: "Hệ thống treo",
        issues: [
          "Xe lắc lư khi chạy",
          "Tiếng kêu từ hệ thống treo",
          "Hệ thống treo quá mềm",
          "Hệ thống treo quá cứng",
          "Amortisseur bị rò rỉ",
          "Lò xo treo gãy",
        ],
        repairs: [
          "Thay amortisseur trước",
          "Thay amortisseur sau",
          "Thay lò xo treo",
          "Thay cao su cân bằng",
          "Thay strut mount",
          "Điều chỉnh độ cao xe",
        ],
        symptomGroups: [
          {
            id: "xe_lac_lu_khi_chay",
            name: "Xe lắc lư khi chạy",
            detailSymptoms: [
              "Xe nhún nhảy trên đường không bằng",
              "Xe tiếp tục dao động sau khi qua ổ gà",
              "Cảm giác mất ổn định khi chạy",
            ],
            repairs: ["Thay amortisseur", "Kiểm tra lò xo treo", "Cân chỉnh hệ thống treo"],
          },
          {
            id: "tieng_keu_tu_he_thong_treo",
            name: "Tiếng kêu từ hệ thống treo",
            detailSymptoms: [
              "Tiếng lục cục khi qua ổ gà",
              "Tiếng kêu kim loại từ bánh xe",
              "Tiếng ken kẹt khi đánh lái",
            ],
            repairs: ["Thay cao su cân bằng", "Thay bi lái", "Bôi trơn khớp nối"],
          },
        ],
      },
      {
        id: "he_thong_lai",
        name: "Hệ thống lái",
        issues: [
          "Lái nặng",
          "Lái lỏng",
          "Xe kéo lệch",
          "Rung lắc ở vô lăng",
          "Tiếng kêu khi đánh lái",
          "Đầu lái lỏng",
          "Dầu trợ lực lái cạn",
        ],
        repairs: [
          "Thay đầu lái",
          "Thay bi lái",
          "Cân chỉnh góc đặt bánh xe",
          "Thay dầu trợ lực lái",
          "Sửa chữa hệ thống trợ lực lái",
          "Sửa chữa rack lái",
        ],
        symptomGroups: [
          {
            id: "lai_nang",
            name: "Lái nặng",
            detailSymptoms: ["Cần dùng nhiều lực để đánh lái", "Lái nặng khi đỗ xe", "Vô lăng không tự về vị trí"],
            repairs: ["Thay dầu trợ lực lái", "Sửa chữa bơm trợ lực lái", "Kiểm tra áp suất lốp"],
          },
          {
            id: "xe_keo_lech",
            name: "Xe kéo lệch",
            detailSymptoms: ["Xe tự kéo sang một bên", "Phải giữ vô lăng để xe chạy thẳng", "Lốp mòn không đều"],
            repairs: ["Cân chỉnh góc đặt bánh xe", "Kiểm tra áp suất lốp", "Thay đầu lái"],
          },
        ],
      },
    ],
  },
]

// Helper functions with hierarchical support
export const getAllIssues = (): string[] => {
  const issues: string[] = []
  diagnosticCategories.forEach((category) => {
    issues.push(...category.issues)
    category.subCategories.forEach((subCategory) => {
      issues.push(...subCategory.issues)
      subCategory.symptomGroups.forEach((group) => {
        issues.push(...group.detailSymptoms)
      })
    })
  })
  return [...new Set(issues)]
}

export const getAllRepairs = (): string[] => {
  const repairs: string[] = []
  diagnosticCategories.forEach((category) => {
    repairs.push(...category.repairs)
    category.subCategories.forEach((subCategory) => {
      repairs.push(...subCategory.repairs)
      subCategory.symptomGroups.forEach((group) => {
        repairs.push(...group.repairs)
      })
    })
  })
  return [...new Set(repairs)]
}

export const getIssuesByCategory = (categoryId: string): string[] => {
  const category = diagnosticCategories.find((cat) => cat.id === categoryId)
  return category ? category.issues : []
}

export const getRepairsByCategory = (categoryId: string): string[] => {
  const category = diagnosticCategories.find((cat) => cat.id === categoryId)
  return category ? category.repairs : []
}

export const getSubCategories = (categoryId: string): SubCategory[] => {
  const category = diagnosticCategories.find((cat) => cat.id === categoryId)
  return category ? category.subCategories : []
}

export const getSymptomGroups = (categoryId: string, subCategoryId: string): SymptomGroup[] => {
  const category = diagnosticCategories.find((cat) => cat.id === categoryId)
  if (!category) return []

  const subCategory = category.subCategories.find((sub) => sub.id === subCategoryId)
  return subCategory ? subCategory.symptomGroups : []
}

// Updated cost estimates with more detailed pricing
export const repairCostEstimates: Record<string, number> = {
  // Thân vỏ xe - Còi xe
  "Thay còi xe": 150000,
  "Sửa chữa mạch điện còi": 100000,
  "Điều chỉnh âm lượng còi": 50000,
  "Thay relay còi": 80000,
  "Thay loa còi": 120000,
  "Sửa chữa mạch khuếch đại": 200000,
  "Thay cầu chì còi": 30000,

  // Thân vỏ xe - Hệ thống đèn
  "Thay bóng đèn pha": 200000,
  "Sửa chữa hệ thống đèn": 300000,
  "Thay đèn hậu": 250000,
  "Sửa chữa đèn xi nhan": 150000,
  "Thay relay đèn": 80000,
  "Sửa chữa mạch điện đèn": 200000,
  "Sửa chữa mạch điện đèn pha": 250000,
  "Thay cầu chì đèn pha": 30000,
  "Thay bóng đèn xi nhan": 100000,
  "Thay relay xi nhan": 80000,
  "Sửa chữa mạch xi nhan": 180000,

  // Thân vỏ xe - Cửa sổ điện
  "Thay motor cửa sổ": 800000,
  "Sửa chữa mạch điện cửa sổ": 300000,
  "Thay công tắc cửa sổ": 200000,
  "Bôi trơn ray cửa sổ": 100000,
  "Kiểm tra nguồn điện": 50000,

  // Động cơ - Hệ thống khởi động
  "Thay bugi": 200000,
  "Thay ắc quy": 1200000,
  "Sửa chữa hệ thống đánh lửa": 800000,
  "Thay starter": 1500000,
  "Kiểm tra hệ thống nhiên liệu": 300000,
  "Vệ sinh kim phun": 500000,
  "Kiểm tra ắc quy": 100000,
  "Sửa chữa starter": 800000,

  // Động cơ - Hệ thống làm mát
  "Thay nước làm mát": 150000,
  "Thay thermostat": 300000,
  "Sửa chữa két nước": 800000,
  "Thay bơm nước": 800000,
  "Thay quạt làm mát": 600000,
  "Sửa chữa đường ống nước": 400000,
  "Vệ sinh hệ thống làm mát": 300000,
  "Kiểm tra quạt làm mát": 100000,
  "Thay gasket": 500000,

  // Hệ thống phanh - Phanh đĩa
  "Thay má phanh": 800000,
  "Thay đĩa phanh": 1200000,
  "Mài đĩa phanh": 300000,
  "Thay caliper phanh": 1500000,
  "Thay má phanh trước": 800000,
  "Thay má phanh sau": 600000,
  "Kiểm tra đĩa phanh": 100000,
  "Cân chỉnh caliper": 200000,

  // Hệ thống phanh - Phanh trống
  "Thay tang phanh": 600000,
  "Mài trống phanh": 400000,
  "Điều chỉnh phanh tay": 200000,
  "Thay dây phanh tay": 300000,
  "Thay tang phanh sau": 600000,

  // Hệ thống truyền động - Ly hợp
  "Thay đĩa ly hợp": 1500000,
  "Thay bạc đạn ly hợp": 800000,
  "Điều chỉnh ly hợp": 300000,
  "Thay master cylinder ly hợp": 800000,
  "Thay pressure plate": 1200000,
  "Bôi trơn cơ cấu ly hợp": 150000,
  "Thay dây ly hợp": 200000,

  // Hệ thống truyền động - Hộp số sàn
  "Thay dầu hộp số": 300000,
  "Sửa chữa hộp số sàn": 2000000,
  "Thay dây cáp chuyển số": 400000,
  "Điều chỉnh cần số": 200000,
  "Thay synchronizer": 1500000,
  "Sửa chữa synchronizer": 1200000,
  "Sửa chữa hộp số": 2500000,

  // Hệ thống treo & lái - Hệ thống treo
  "Thay amortisseur": 1000000,
  "Kiểm tra lò xo treo": 100000,
  "Cân chỉnh hệ thống treo": 300000,
  "Thay amortisseur trước": 1000000,
  "Thay amortisseur sau": 800000,
  "Thay lò xo treo": 600000,
  "Thay cao su cân bằng": 300000,
  "Thay strut mount": 400000,
  "Điều chỉnh độ cao xe": 200000,
  "Thay bi lái": 600000,
  "Bôi trơn khớp nối": 100000,

  // Hệ thống treo & lái - Hệ thống lái
  "Thay đầu lái": 400000,
  "Cân chỉnh góc đặt bánh xe": 200000,
  "Thay dầu trợ lực lái": 150000,
  "Sửa chữa hệ thống trợ lực lái": 800000,
  "Sửa chữa rack lái": 1500000,
  "Sửa chữa bơm trợ lực lái": 800000,
  "Kiểm tra áp suất lốp": 50000,

  // Default fallback
  "Sửa chữa chung": 500000,
}

// Updated labor hour estimates
export const laborHourEstimates: Record<string, number> = {
  // Còi xe
  "Thay còi xe": 0.5,
  "Sửa chữa mạch điện còi": 1,
  "Điều chỉnh âm lượng còi": 0.3,
  "Thay relay còi": 0.2,

  // Hệ thống đèn
  "Thay bóng đèn pha": 0.5,
  "Sửa chữa hệ thống đèn": 2,
  "Thay đèn hậu": 1,
  "Sửa chữa đèn xi nhan": 1,

  // Cửa sổ điện
  "Thay motor cửa sổ": 2,
  "Sửa chữa mạch điện cửa sổ": 1.5,
  "Thay công tắc cửa sổ": 0.5,
  "Bôi trơn ray cửa sổ": 0.5,

  // Động cơ - khởi động
  "Thay bugi": 0.5,
  "Thay ắc quy": 0.5,
  "Sửa chữa hệ thống đánh lửa": 3,
  "Thay starter": 3,
  "Vệ sinh kim phun": 2,

  // Động cơ - làm mát
  "Thay nước làm mát": 0.5,
  "Thay thermostat": 2,
  "Sửa chữa két nước": 4,
  "Thay bơm nước": 3,
  "Thay quạt làm mát": 2,

  // Phanh
  "Thay má phanh": 2,
  "Thay đĩa phanh": 3,
  "Mài đĩa phanh": 2,
  "Thay caliper phanh": 2.5,
  "Điều chỉnh phanh tay": 1,

  // Ly hợp
  "Thay đĩa ly hợp": 6,
  "Thay bạc đạn ly hợp": 4,
  "Điều chỉnh ly hợp": 1,
  "Thay master cylinder ly hợp": 2,

  // Hộp số
  "Thay dầu hộp số": 1,
  "Sửa chữa hộp số sàn": 8,
  "Thay dây cáp chuyển số": 2,
  "Thay synchronizer": 6,

  // Hệ thống treo
  "Thay amortisseur": 2,
  "Thay lò xo treo": 2.5,
  "Thay cao su cân bằng": 1,
  "Cân chỉnh hệ thống treo": 1.5,

  // Hệ thống lái
  "Thay đầu lái": 1.5,
  "Cân chỉnh góc đặt bánh xe": 1,
  "Thay dầu trợ lực lái": 0.5,
  "Sửa chữa rack lái": 4,

  // Default
  default: 2,
}
