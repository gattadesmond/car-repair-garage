// Fetch and analyze the CSV data
async function analyzeSymptoms() {
  try {
    console.log("Đang tải dữ liệu từ CSV...")

    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/trieuchungxe-0nj4rXtWMZvUViDIdAFGbZ9xRRAtfe.csv",
    )
    const csvText = await response.text()

    console.log("Dữ liệu CSV đã tải thành công!")
    console.log("Kích thước file:", csvText.length, "ký tự")

    // Parse CSV manually (simple parser)
    const lines = csvText.split("\n").filter((line) => line.trim())
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    console.log("Headers:", headers)
    console.log("Số dòng dữ liệu:", lines.length - 1)

    const data = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))
      if (values.length === headers.length) {
        const row = {}
        headers.forEach((header, index) => {
          row[header] = values[index]
        })
        data.push(row)
      }
    }

    console.log("Đã parse thành công", data.length, "dòng dữ liệu")

    // Analyze the data structure
    const systemsMap = new Map()
    const symptomsMap = new Map()

    data.forEach((row) => {
      const mainSystem = row["Hệ thống chính"]
      const subSystem = row["Hệ thống phụ"]
      const symptomGroup = row["Nhóm triệu chứng"]
      const detailSymptom = row["Triệu chứng chi tiết"]
      const task = row["Nhiệm vụ"]

      if (!systemsMap.has(mainSystem)) {
        systemsMap.set(mainSystem, {
          name: mainSystem,
          subSystems: new Set(),
          symptoms: new Set(),
          repairs: new Set(),
        })
      }

      const system = systemsMap.get(mainSystem)
      if (subSystem) system.subSystems.add(subSystem)
      if (symptomGroup) system.symptoms.add(symptomGroup)
      if (detailSymptom && detailSymptom !== "Lý do khác (nhập tay)") {
        system.symptoms.add(detailSymptom)
      }
      if (task && task !== "Sửa chữa chung") {
        system.repairs.add(task)
      }
    })

    console.log("\n=== PHÂN TÍCH DỮ LIỆU ===")
    console.log("Số hệ thống chính:", systemsMap.size)

    // Convert to our format
    const diagnosticCategories = []

    systemsMap.forEach((systemData, systemName) => {
      const categoryId = systemName
        .toLowerCase()
        .replace(/hệ thống /g, "")
        .replace(/\s+/g, "_")
        .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
        .replace(/[èéẹẻẽêềếệểễ]/g, "e")
        .replace(/[ìíịỉĩ]/g, "i")
        .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
        .replace(/[ùúụủũưừứựửữ]/g, "u")
        .replace(/[ỳýỵỷỹ]/g, "y")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9_]/g, "")

      const category = {
        id: categoryId,
        name: systemName,
        issues: Array.from(systemData.symptoms).filter((s) => s && s.trim()),
        repairs: Array.from(systemData.repairs).filter((r) => r && r.trim()),
      }

      diagnosticCategories.push(category)

      console.log(`\n${systemName}:`)
      console.log(`  - ID: ${categoryId}`)
      console.log(`  - Triệu chứng: ${category.issues.length}`)
      console.log(`  - Sửa chữa: ${category.repairs.length}`)
    })

    console.log("\n=== KẾT QUẢ CUỐI CÙNG ===")
    console.log("Tổng số danh mục:", diagnosticCategories.length)
    console.log(
      "Tổng triệu chứng:",
      diagnosticCategories.reduce((sum, cat) => sum + cat.issues.length, 0),
    )
    console.log(
      "Tổng sửa chữa:",
      diagnosticCategories.reduce((sum, cat) => sum + cat.repairs.length, 0),
    )

    // Output the formatted data
    console.log("\n=== DỮ LIỆU FORMATTED ===")
    console.log(JSON.stringify(diagnosticCategories, null, 2))

    return diagnosticCategories
  } catch (error) {
    console.error("Lỗi khi phân tích dữ liệu:", error)
  }
}

// Run the analysis
analyzeSymptoms()
