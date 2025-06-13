// Dữ liệu xe hơi phổ biến tại Việt Nam

export interface CarBrand {
  id: string
  name: string
  models: CarModel[]
}

export interface CarModel {
  id: string
  name: string
  years?: number[] // Các năm sản xuất phổ biến
}

export const carBrands: CarBrand[] = [
  {
    id: "toyota",
    name: "Toyota",
    models: [
      { id: "vios", name: "Vios", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "camry", name: "Camry", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "fortuner", name: "Fortuner", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "innova", name: "Innova", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "corolla-cross", name: "Corolla Cross", years: [2020, 2021, 2022, 2023, 2024] },
      { id: "corolla-altis", name: "Corolla Altis", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "yaris", name: "Yaris", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "land-cruiser", name: "Land Cruiser", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "hilux", name: "Hilux", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "raize", name: "Raize", years: [2021, 2022, 2023, 2024] },
    ],
  },
  {
    id: "honda",
    name: "Honda",
    models: [
      { id: "city", name: "City", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "civic", name: "Civic", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "cr-v", name: "CR-V", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "hr-v", name: "HR-V", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "accord", name: "Accord", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "brio", name: "Brio", years: [2019, 2020, 2021, 2022, 2023, 2024] },
    ],
  },
  {
    id: "hyundai",
    name: "Hyundai",
    models: [
      { id: "accent", name: "Accent", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "i10", name: "i10", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "elantra", name: "Elantra", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "tucson", name: "Tucson", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "santa-fe", name: "Santa Fe", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "kona", name: "Kona", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "creta", name: "Creta", years: [2022, 2023, 2024] },
    ],
  },
  {
    id: "kia",
    name: "KIA",
    models: [
      { id: "morning", name: "Morning", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "soluto", name: "Soluto", years: [2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "cerato", name: "Cerato", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "k3", name: "K3", years: [2022, 2023, 2024] },
      { id: "seltos", name: "Seltos", years: [2020, 2021, 2022, 2023, 2024] },
      { id: "sportage", name: "Sportage", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "sorento", name: "Sorento", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "carnival", name: "Carnival", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
    ],
  },
  {
    id: "mazda",
    name: "Mazda",
    models: [
      { id: "mazda2", name: "Mazda2", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "mazda3", name: "Mazda3", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "mazda6", name: "Mazda6", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "cx-3", name: "CX-3", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "cx-5", name: "CX-5", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "cx-8", name: "CX-8", years: [2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "cx-30", name: "CX-30", years: [2020, 2021, 2022, 2023, 2024] },
    ],
  },
  {
    id: "ford",
    name: "Ford",
    models: [
      { id: "ranger", name: "Ranger", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "everest", name: "Everest", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "territory", name: "Territory", years: [2021, 2022, 2023, 2024] },
      { id: "explorer", name: "Explorer", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
    ],
  },
  {
    id: "mitsubishi",
    name: "Mitsubishi",
    models: [
      { id: "xpander", name: "Xpander", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "attrage", name: "Attrage", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "outlander", name: "Outlander", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "pajero-sport", name: "Pajero Sport", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "triton", name: "Triton", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
    ],
  },
  {
    id: "nissan",
    name: "Nissan",
    models: [
      { id: "almera", name: "Almera", years: [2021, 2022, 2023, 2024] },
      { id: "navara", name: "Navara", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "terra", name: "Terra", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "kicks", name: "Kicks", years: [2022, 2023, 2024] },
    ],
  },
  {
    id: "suzuki",
    name: "Suzuki",
    models: [
      { id: "swift", name: "Swift", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "xl7", name: "XL7", years: [2020, 2021, 2022, 2023, 2024] },
      { id: "ertiga", name: "Ertiga", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "ciaz", name: "Ciaz", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
    ],
  },
  {
    id: "mercedes",
    name: "Mercedes-Benz",
    models: [
      { id: "c-class", name: "C-Class", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "e-class", name: "E-Class", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "s-class", name: "S-Class", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "glc", name: "GLC", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "gle", name: "GLE", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
    ],
  },
  {
    id: "bmw",
    name: "BMW",
    models: [
      { id: "3-series", name: "3 Series", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "5-series", name: "5 Series", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "7-series", name: "7 Series", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "x3", name: "X3", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "x5", name: "X5", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
    ],
  },
  {
    id: "audi",
    name: "Audi",
    models: [
      { id: "a4", name: "A4", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "a6", name: "A6", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "q3", name: "Q3", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "q5", name: "Q5", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { id: "q7", name: "Q7", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
    ],
  },
  {
    id: "vinfast",
    name: "VinFast",
    models: [
      { id: "fadil", name: "Fadil", years: [2019, 2020, 2021, 2022] },
      { id: "lux-a", name: "Lux A", years: [2019, 2020, 2021, 2022] },
      { id: "lux-sa", name: "Lux SA", years: [2019, 2020, 2021, 2022] },
      { id: "vf-e34", name: "VF e34", years: [2021, 2022, 2023, 2024] },
      { id: "vf-8", name: "VF 8", years: [2022, 2023, 2024] },
      { id: "vf-9", name: "VF 9", years: [2022, 2023, 2024] },
    ],
  },
]

// Hàm helper
export const getCarBrandById = (brandId: string): CarBrand | undefined => {
  return carBrands.find((brand) => brand.id === brandId)
}

export const getCarModelById = (brandId: string, modelId: string): CarModel | undefined => {
  const brand = getCarBrandById(brandId)
  return brand?.models.find((model) => model.id === modelId)
}

export const getAvailableYears = (brandId: string, modelId: string): number[] => {
  const model = getCarModelById(brandId, modelId)
  return model?.years || []
}

// Tạo danh sách năm từ 1990 đến năm hiện tại
export const generateYearsList = (): number[] => {
  const currentYear = new Date().getFullYear()
  const years: number[] = []
  for (let year = currentYear; year >= 1990; year--) {
    years.push(year)
  }
  return years
}
