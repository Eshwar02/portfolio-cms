// Config-driven resource definitions. Every CRUD screen is generated from these,
// so adding a field is a one-line change and all resources stay consistent.

export const STATUS_FIELD = {
  name: "status",
  label: "Status",
  type: "select",
  options: ["draft", "published"],
};
const ORDER_FIELD = { name: "display_order", label: "Order", type: "number" };

export const RESOURCES = {
  projects: {
    label: "Projects",
    endpoint: "projects",
    idKey: "slug",
    columns: ["title", "status", "featured"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "image", label: "Image", type: "file" },
      { name: "github_url", label: "GitHub URL", type: "url" },
      { name: "live_url", label: "Live URL", type: "url" },
      { name: "featured", label: "Featured", type: "boolean" },
      ORDER_FIELD,
      STATUS_FIELD,
    ],
  },
  skills: {
    label: "Skills",
    endpoint: "skills",
    idKey: "id",
    columns: ["name", "category", "status"],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "category", label: "Category", type: "text" },
      { name: "proficiency", label: "Proficiency (0-100)", type: "number" },
      ORDER_FIELD,
      STATUS_FIELD,
    ],
  },
  experience: {
    label: "Experience",
    endpoint: "experience",
    idKey: "id",
    columns: ["position", "company", "status"],
    fields: [
      { name: "company", label: "Company", type: "text", required: true },
      { name: "position", label: "Position", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "start_date", label: "Start date", type: "date", required: true },
      { name: "end_date", label: "End date (blank = current)", type: "date" },
      ORDER_FIELD,
      STATUS_FIELD,
    ],
  },
  education: {
    label: "Education",
    endpoint: "education",
    idKey: "id",
    columns: ["degree", "institution", "status"],
    fields: [
      { name: "institution", label: "Institution", type: "text", required: true },
      { name: "degree", label: "Degree", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "year", label: "Year", type: "text" },
      ORDER_FIELD,
      STATUS_FIELD,
    ],
  },
  services: {
    label: "Services",
    endpoint: "services",
    idKey: "id",
    columns: ["title", "status"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "icon", label: "Icon name", type: "text" },
      ORDER_FIELD,
      STATUS_FIELD,
    ],
  },
  testimonials: {
    label: "Testimonials",
    endpoint: "testimonials",
    idKey: "id",
    columns: ["author", "role", "status"],
    fields: [
      { name: "author", label: "Author", type: "text", required: true },
      { name: "role", label: "Role", type: "text" },
      { name: "quote", label: "Quote", type: "textarea", required: true },
      { name: "avatar", label: "Avatar", type: "file" },
      ORDER_FIELD,
      STATUS_FIELD,
    ],
  },
  blogs: {
    label: "Blog",
    endpoint: "blogs",
    idKey: "slug",
    columns: ["title", "status"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      { name: "body", label: "Body", type: "textarea" },
      { name: "cover_image", label: "Cover image", type: "file" },
      ORDER_FIELD,
      STATUS_FIELD,
    ],
  },
  "social-links": {
    label: "Social Links",
    endpoint: "social-links",
    idKey: "id",
    columns: ["platform", "url"],
    fields: [
      { name: "platform", label: "Platform", type: "text", required: true },
      { name: "url", label: "URL", type: "url", required: true },
      ORDER_FIELD,
    ],
  },
};

export const RESOURCE_KEYS = Object.keys(RESOURCES);
