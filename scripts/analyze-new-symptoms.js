// Fetch and analyze the updated CSV data
async function analyzeNewSymptoms() {
  try {
    console.log("Đang tải dữ liệu CSV mới...")

    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/trieuchungxe-PInK0tOocTtecXvQTAfVDqukwUljqt.csv",
    )
    const csvText = await response.text()

    console.log("Dữ liệu CSV đã tải thành công!")
    console.log("Kích thước file:", csvText.length, "ký tự")

    // Parse CSV with proper handling of commas in quotes
    const lines = csvText.split("\n").filter((line) => line.trim())
    const headers = parseCSVLine(lines[0])

    console.log("Headers:", headers)
    console.log("Số dòng dữ liệu:", lines.length - 1)

    const data = []
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      if (values.length === headers.length) {
        const row = {}
        headers.forEach((header, index) => {
          row[header] = values[index] || ""
        })
        data.push(row)
      }
    }

    console.log("Đã parse thành công", data.length, "dòng dữ liệu")

    // Analyze the hierarchical structure
    const systemsHierarchy = new Map()

    data.forEach((row) => {
      const task = row["Nhiệm vụ"]
      const mainSystem = row["Hệ thống chính"]
      const subSystem = row["Hệ thống phụ"]
      const symptomGroup = row["Nhóm triệu chứng"]
      const detailSymptom = row["Triệu chứng chi tiết"]

      // Initialize main system if not exists
      if (!systemsHierarchy.has(mainSystem)) {
        systemsHierarchy.set(mainSystem, {
          name: mainSystem,
          subSystems: new Map(),
          allSymptoms: new Set(),
          allRepairs: new Set(),
        })
      }

      const mainSystemData = systemsHierarchy.get(mainSystem)

      // Initialize sub system if not exists
      if (subSystem && !mainSystemData.subSystems.has(subSystem)) {
        mainSystemData.subSystems.set(subSystem, {
          name: subSystem,
          symptomGroups: new Map(),
          symptoms: new Set(),
          repairs: new Set(),
        })
      }

      const subSystemData = subSystem ? mainSystemData.subSystems.get(subSystem) : null

      // Add symptom group
      if (subSystemData && symptomGroup) {
        if (!subSystemData.symptomGroups.has(symptomGroup)) {
          subSystemData.symptomGroups.set(symptomGroup, {
            name: symptomGroup,
            detailSymptoms: new Set(),
            repairs: new Set(),
          })
        }

        const groupData = subSystemData.symptomGroups.get(symptomGroup)

        // Add detail symptoms
        if (detailSymptom && detailSymptom !== "Lý do khác (nhập tay)") {
          groupData.detailSymptoms.add(detailSymptom)
          subSystemData.symptoms.add(detailSymptom)
          mainSystemData.allSymptoms.add(detailSymptom)
        }

        // Add group symptom as general symptom
        subSystemData.symptoms.add(symptomGroup)
        mainSystemData.allSymptoms.add(symptomGroup)

        // Add repairs/tasks
        if (task && task !== "Sửa chữa chung") {
          groupData.repairs.add(task)
          subSystemData.repairs.add(task)
          mainSystemData.allRepairs.add(task)
        }
      }
    })

    console.log("\n=== PHÂN TÍCH CẤU TRÚC PHÂN CẤP ===")
    console.log("Số hệ thống chính:", systemsHierarchy.size)

    // Display structure
    systemsHierarchy.forEach((mainData, mainName) => {
      console.log(`\n📁 ${mainName}:`)
      console.log(`   Tổng triệu chứng: ${mainData.allSymptoms.size}`)
      console.log(`   Tổng sửa chữa: ${mainData.allRepairs.size}`)
      console.log(`   Hệ thống phụ: ${mainData.subSystems.size}`)

      mainData.subSystems.forEach((subData, subName) => {
        console.log(`   └── 📂 ${subName}:`)
        console.log(`       Triệu chứng: ${subData.symptoms.size}`)
        console.log(`       Sửa chữa: ${subData.repairs.size}`)
        console.log(`       Nhóm triệu chứng: ${subData.symptomGroups.size}`)

        subData.symptomGroups.forEach((groupData, groupName) => {
          console.log(`       └── 📄 ${groupName}: ${groupData.detailSymptoms.size} chi tiết`)
        })
      })
    })

    // Convert to our diagnostic categories format
    const diagnosticCategories = []

    systemsHierarchy.forEach((mainData, mainName) => {
      const categoryId = generateId(mainName)

      const category = {
        id: categoryId,
        name: mainName,
        issues: Array.from(mainData.allSymptoms),
        repairs: Array.from(mainData.allRepairs),
        subCategories: [],
      }

      // Add sub-categories
      mainData.subSystems.forEach((subData, subName) => {
        const subCategory = {
          id: generateId(subName),
          name: subName,
          issues: Array.from(subData.symptoms),
          repairs: Array.from(subData.repairs),
          symptomGroups: [],
        }

        // Add symptom groups
        subData.symptomGroups.forEach((groupData, groupName) => {
          const group = {
            id: generateId(groupName),
            name: groupName,
            detailSymptoms: Array.from(groupData.detailSymptoms),
            repairs: Array.from(groupData.repairs),
          }
          subCategory.symptomGroups.push(group)
        })

        category.subCategories.push(subCategory)
      })

      diagnosticCategories.push(category)
    })

    console.log("\n=== KẾT QUẢ CUỐI CÙNG ===")
    console.log("Tổng số hệ thống chính:", diagnosticCategories.length)
    console.log(
      "Tổng số hệ thống phụ:",
      diagnosticCategories.reduce((sum, cat) => sum + cat.subCategories.length, 0),
    )
    console.log(
      "Tổng triệu chứng:",
      diagnosticCategories.reduce((sum, cat) => sum + cat.issues.length, 0),
    )

    return diagnosticCategories
  } catch (error) {
    console.error("Lỗi khi phân tích dữ liệu:", error)
  }
}

// Helper function to parse CSV line with proper quote handling
function parseCSVLine(line) {
  const result = []
  let current = ""
  let inQuotes = false
  let i = 0

  while (i < line.length) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"'
        i += 2
      } else {
        // Toggle quote state
        inQuotes = !inQuotes
        i++
      }
    } else if (char === "," && !inQuotes) {
      // Field separator
      result.push(current.trim())
      current = ""
      i++
    } else {
      current += char
      i++
    }
  }

  // Add the last field
  result.push(current.trim())

  return result
}

// Helper function to generate ID from Vietnamese text
function generateId(text) {
  return text
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
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
}

// Run the analysis
analyzeNewSymptoms()
