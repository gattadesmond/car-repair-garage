// Fetch and analyze the new CSV data for better UI design
async function analyzeNewCSV() {
  try {
    console.log("Đang tải dữ liệu CSV mới...")

    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/trieu%20chung%20xe-Sh9nGLwo4FlEM5YqKdCUhaIahBpWNp.csv",
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

    // Analyze the hierarchical structure for optimal UI
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
          totalSymptoms: 0,
          totalTasks: new Set(),
        })
      }

      const mainSystemData = systemsHierarchy.get(mainSystem)

      // Initialize sub system if not exists
      if (subSystem && !mainSystemData.subSystems.has(subSystem)) {
        mainSystemData.subSystems.set(subSystem, {
          name: subSystem,
          symptomGroups: new Map(),
          symptoms: new Set(),
          tasks: new Set(),
        })
      }

      const subSystemData = subSystem ? mainSystemData.subSystems.get(subSystem) : null

      // Add symptom group
      if (subSystemData && symptomGroup) {
        if (!subSystemData.symptomGroups.has(symptomGroup)) {
          subSystemData.symptomGroups.set(symptomGroup, {
            name: symptomGroup,
            detailSymptoms: new Set(),
            tasks: new Set(),
          })
        }

        const groupData = subSystemData.symptomGroups.get(symptomGroup)

        // Add detail symptoms
        if (detailSymptom && detailSymptom !== "Lý do khác (nhập tay)") {
          groupData.detailSymptoms.add(detailSymptom)
          subSystemData.symptoms.add(detailSymptom)
          mainSystemData.totalSymptoms++
        }

        // Add group symptom as general symptom
        subSystemData.symptoms.add(symptomGroup)

        // Add tasks
        if (task && task !== "Sửa chữa chung") {
          groupData.tasks.add(task)
          subSystemData.tasks.add(task)
          mainSystemData.totalTasks.add(task)
        }
      }
    })

    console.log("\n=== PHÂN TÍCH CẤU TRÚC CHO UI ===")
    console.log("Số hệ thống chính:", systemsHierarchy.size)

    // Display structure for UI design
    systemsHierarchy.forEach((mainData, mainName) => {
      console.log(`\n📁 ${mainName}:`)
      console.log(`   Tổng triệu chứng: ${mainData.totalSymptoms}`)
      console.log(`   Tổng nhiệm vụ: ${mainData.totalTasks.size}`)
      console.log(`   Hệ thống phụ: ${mainData.subSystems.size}`)

      mainData.subSystems.forEach((subData, subName) => {
        console.log(`   └── 📂 ${subName}:`)
        console.log(`       Triệu chứng: ${subData.symptoms.size}`)
        console.log(`       Nhiệm vụ: ${subData.tasks.size}`)
        console.log(`       Nhóm triệu chứng: ${subData.symptomGroups.size}`)

        // Show some examples for UI design
        let groupCount = 0
        subData.symptomGroups.forEach((groupData, groupName) => {
          if (groupCount < 3) {
            // Show first 3 groups as examples
            console.log(`       └── 📄 ${groupName}: ${groupData.detailSymptoms.size} chi tiết`)
            groupCount++
          }
        })
        if (subData.symptomGroups.size > 3) {
          console.log(`       └── ... và ${subData.symptomGroups.size - 3} nhóm khác`)
        }
      })
    })

    // Generate optimized data structure for UI
    const uiOptimizedData = []

    systemsHierarchy.forEach((mainData, mainName) => {
      const mainSystemUI = {
        id: generateId(mainName),
        name: mainName,
        icon: getSystemIcon(mainName),
        totalSymptoms: mainData.totalSymptoms,
        subSystems: [],
      }

      mainData.subSystems.forEach((subData, subName) => {
        const subSystemUI = {
          id: generateId(subName),
          name: subName,
          symptomCount: subData.symptoms.size,
          groups: [],
        }

        subData.symptomGroups.forEach((groupData, groupName) => {
          const groupUI = {
            id: generateId(groupName),
            name: groupName,
            symptoms: Array.from(groupData.detailSymptoms),
            tasks: Array.from(groupData.tasks),
          }
          subSystemUI.groups.push(groupUI)
        })

        mainSystemUI.subSystems.push(subSystemUI)
      })

      uiOptimizedData.push(mainSystemUI)
    })

    console.log("\n=== DỮ LIỆU TỐI ƯU CHO UI ===")
    console.log("Cấu trúc 3 cấp:")
    console.log("1. Hệ thống chính (", uiOptimizedData.length, "hệ thống)")
    console.log(
      "2. Hệ thống phụ (",
      uiOptimizedData.reduce((sum, sys) => sum + sys.subSystems.length, 0),
      "hệ thống)",
    )
    console.log(
      "3. Nhóm triệu chứng (",
      uiOptimizedData.reduce(
        (sum, sys) => sum + sys.subSystems.reduce((subSum, sub) => subSum + sub.groups.length, 0),
        0,
      ),
      "nhóm)",
    )

    // Suggest UI patterns
    console.log("\n=== GỢI Ý UI PATTERNS ===")
    console.log("1. Tab Navigation cho hệ thống chính")
    console.log("2. Accordion/Collapsible cho hệ thống phụ")
    console.log("3. Checkbox groups cho nhóm triệu chứng")
    console.log("4. Search/Filter functionality")
    console.log("5. Badge counters cho số lượng triệu chứng")

    return uiOptimizedData
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

// Helper function to suggest icons for systems
function getSystemIcon(systemName) {
  const iconMap = {
    "Thân vỏ xe": "PaintBucket",
    "Động cơ": "Engine",
    "Hệ thống phanh": "Brake",
    "Hệ thống truyền động": "Cog",
    "Hệ thống treo & lái": "Disc",
    "Hệ thống điện": "Zap",
    "Hệ thống làm mát": "Thermometer",
    "Hệ thống nhiên liệu": "Fuel",
    "Hệ thống xả": "Wind",
  }
  return iconMap[systemName] || "Wrench"
}

// Run the analysis
analyzeNewCSV()
