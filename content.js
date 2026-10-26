// 唯一的日常内容文件。使用英文引号；字符串中的换行写为 \n。
// 改完后保存，双击 index.html 预览，再把本文件和新增图片提交到 GitHub。
// 只填准备公开的信息。下面所有 example: true 的项目均为演示模板，不代表真实研究成果。
window.PORTFOLIO = {
  version: 1,
  profile: {
    name: "Shuotong Su",
    initials: "SS",
    role: "PhD",
    headline: "Cities in focus.\nIdeas in motion.",
    introduction: "A personal collection of research, software and projects exploring cities, transportation and energy.",
    biography: "I am Shuotong Su. This is a space for my research, the tools I develop, and the questions that connect urban life, mobility and energy.\n\nExplore my software, industry projects, academic work and publications using the pages above.",
    orcid: "0009-0009-8239-4528",
    photo: "assets/portrait.png",
    photoAlt: "Portrait of Shuotong Su",
    background: "assets/city-hero.webp",
    backgroundAlt: "An AI-generated concept of a coastal city at night",
    backgroundCaption: "An urban future, imagined · AI-generated city concept",
    // 没有的字段保持空字符串，不会显示空按钮。
    affiliation: "",
    location: "",
    email: "",
    cv: "", // 例如 files/shuotong-su-cv.pdf
    links: [], // 例如 { label: "GitHub", url: "https://github.com/你的账号" }
    interests: ["Urban systems", "Transportation", "Energy", "Interactive research tools"],
    // 可添加经历：{ period: "2024–2026", title: "职位或学位", organization: "单位", description: "说明" }
    experience: [],
    // 可添加个人图片：{ src: "assets/my-photo.jpg", alt: "图片描述", caption: "图片说明" }
    gallery: []
  },
  pages: {
    software: {
      eyebrow: "01 / SOFTWARE & PRODUCTS",
      title: "Ideas you can\ninteract with.",
      introduction: "Software, products and practical tools. Explore a project, read its story and open a working demonstration."
    },
    industry: {
      eyebrow: "02 / INDUSTRY PROJECTS",
      title: "From questions\nto applications.",
      introduction: "A space for industry collaborations, applied projects and interactive demonstrations."
    },
    academic: {
      eyebrow: "03 / ACADEMIC PROJECTS",
      title: "Research, made\nexplorable.",
      introduction: "Academic projects, methods and research prototypes, with space to explore the work behind each idea."
    },
    publications: {
      eyebrow: "04 / PUBLICATIONS",
      title: "Knowledge,\nshared.",
      introduction: "Published work, research details and figures. Browse the collection or export a citation."
    }
  },
  // 在对应数组 [] 内添加真实项目。完整填写示例见 README-使用与发布.md。
  // 项目字段：id, title, year, status, summary, description, role, tags, cover, gallery,
  //           demoUrl, embedDemo, codeUrl, websiteUrl, downloads。
  // id 使用唯一的英文字母、数字和连字符。
  software: [],
  industry: [],
  academic: [],
  // 以下是随包提供的可运行演示；明确标为模板。不要只删 example 标记来冒充真实成果。
  // 不想展示模板时，把整个 examples 改成：examples: { software: [], industry: [], academic: [] },
  examples: {
    software: [{
      id: "scenario-notebook", title: "Urban Scenario Notebook", year: 2026,
      status: "Interactive example", example: true,
      summary: "Adjust a daily demand profile and compare a simple baseline with a flexible-demand scenario.",
      description: "This working demonstration shows how a software project can be presented on this website. Its values are illustrative, not measured city data.\n\nChange the inputs, inspect the chart and download the scenario as a CSV file. Replace this example with your own software when ready.",
      role: "Website demonstration template", tags: ["Browser tool", "Scenarios", "CSV export"],
      cover: "assets/scenario-preview.svg", gallery: [],
      demoUrl: "demos/scenario-notebook/index.html", embedDemo: true,
      codeUrl: "", websiteUrl: "", downloads: []
    }],
    industry: [{
      id: "energy-planner", title: "Urban Energy Planner", year: 2026,
      status: "Interactive example", example: true,
      summary: "Explore how demand and rooftop solar capacity interact across an illustrative day.",
      description: "A demonstration of an interactive industry-project showcase. This model compares hourly demand with an idealized solar generation curve.\n\nIt is a website template, not a commissioned industry project, an engineering design or a forecast. All assumptions are visible inside the demonstration.",
      role: "Website demonstration template", tags: ["Energy", "Solar", "Scenario planning"],
      cover: "assets/energy-preview.svg", gallery: [],
      demoUrl: "demos/energy-planner/index.html", embedDemo: true,
      codeUrl: "", websiteUrl: "", downloads: []
    }],
    academic: [{
      id: "fleet-explorer", title: "Electric Fleet Explorer", year: 2026,
      status: "Interactive example", example: true,
      summary: "Explore simplified relationships between collection demand, fleet size and energy use.",
      description: "An illustrative academic-project presentation with a working browser model. It is supplied as a template and is not an implementation or validation of a published paper.\n\nChange the collection demand and available vehicles to compare an example fleet's workload. The equations and limitations are shown inside the demonstration.",
      role: "Website demonstration template", tags: ["Transportation", "Electric fleets", "Methods"],
      cover: "assets/fleet-preview.svg", gallery: [],
      demoUrl: "demos/fleet-explorer/index.html", embedDemo: true,
      codeUrl: "", websiteUrl: "", downloads: []
    }]
  },
  publications: [{
    id: "waste-bin-allocation-2025",
    title: "A flexible waste bin number allocation plan applied to waste transportation electric fleets in smart cities",
    authors: "Shuotong Su, Jiawen Hu, Wenjun Li, Domokos Esztergár-Kiss, Tuqiang Zhou",
    year: 2025,
    type: "Journal article",
    venue: "Sustainable Cities and Society",
    volume: "121",
    article: "106223",
    doi: "10.1016/j.scs.2025.106223",
    url: "https://www.sciencedirect.com/science/article/pii/S2210670725001003",
    pdf: "", // 可填 files/paper.pdf 或你有权分享的公开全文链接。
    abstract: "",
    body: "", // 可填写论文介绍，多段文字之间用 \n\n。
    images: [] // 例如 { src: "assets/paper-figure.png", alt: "示意图描述", caption: "Figure 1. ..." }
  }]
};
