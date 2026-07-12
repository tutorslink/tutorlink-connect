import { Client, Databases, Permission, Role, Storage } from "node-appwrite";

const endpoint = process.env.APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1";
const projectId = process.env.APPWRITE_PROJECT_ID || "tutorslink";
const databaseId = process.env.APPWRITE_DATABASE_ID || "TutorsLinkDatabase";
const apiKey = process.env.APPWRITE_API_KEY;

if (!apiKey) {
  throw new Error("Missing APPWRITE_API_KEY. Use an Appwrite API key with database and storage admin access.");
}

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
const databases = new Databases(client);
const storage = new Storage(client);

type Attribute =
  | { kind: "string"; key: string; size?: number; required?: boolean; array?: boolean; default?: string | null; encrypt?: boolean }
  | { kind: "text"; key: string; required?: boolean; array?: boolean; default?: string | null; encrypt?: boolean }
  | { kind: "email"; key: string; required?: boolean; array?: boolean; default?: string | null }
  | { kind: "url"; key: string; required?: boolean; array?: boolean; default?: string | null }
  | { kind: "bool"; key: string; required?: boolean; default?: boolean; array?: boolean }
  | { kind: "int"; key: string; required?: boolean; min?: number; max?: number; default?: number; array?: boolean }
  | { kind: "double"; key: string; required?: boolean; min?: number; max?: number; default?: number; array?: boolean }
  | { kind: "datetime"; key: string; required?: boolean; default?: string | null; array?: boolean }
  | { kind: "enum"; key: string; elements: string[]; required?: boolean; default?: string | null; array?: boolean };

type CollectionDef = {
  id: string;
  name: string;
  permissions: string[];
  documentSecurity?: boolean;
  attributes: Attribute[];
};

const publicRead = [Permission.read(Role.any())];
const authCrud = [Permission.read(Role.users()), Permission.create(Role.users()), Permission.update(Role.users()), Permission.delete(Role.users())];
const managerCrud = [Permission.read(Role.users()), Permission.create(Role.users()), Permission.update(Role.users()), Permission.delete(Role.users())];

async function ignoreExists<T>(label: string, promise: Promise<T>) {
  try {
    return await promise;
  } catch (error) {
    console.warn(`Skipping ${label}:`, error instanceof Error ? error.message : String(error));
    return null;
  }
}

async function ensureDatabase() {
  await ignoreExists("database create", databases.create(databaseId, "Tutors Link", true));
}

async function ensureCollection(def: CollectionDef) {
  await ignoreExists(
    `collection ${def.id}`,
    databases.createCollection({
      databaseId,
      collectionId: def.id,
      name: def.name,
      permissions: def.permissions,
      documentSecurity: def.documentSecurity ?? false,
      enabled: true,
    }),
  );
  for (const attr of def.attributes) {
    if (attr.kind === "string") {
      await ignoreExists(
        `${def.id}.${attr.key}`,
        databases.createStringAttribute({
          databaseId,
          collectionId: def.id,
          key: attr.key,
          size: attr.size ?? 255,
          required: attr.required ?? false,
          xdefault: attr.default ?? undefined,
          array: attr.array ?? false,
          encrypt: attr.encrypt ?? false,
        }),
      );
    } else if (attr.kind === "text") {
      await ignoreExists(
        `${def.id}.${attr.key}`,
        databases.createTextAttribute({
          databaseId,
          collectionId: def.id,
          key: attr.key,
          required: attr.required ?? false,
          xdefault: attr.default ?? undefined,
          array: attr.array ?? false,
          encrypt: attr.encrypt ?? false,
        }),
      );
    } else if (attr.kind === "email") {
      await ignoreExists(
        `${def.id}.${attr.key}`,
        databases.createEmailAttribute({
          databaseId,
          collectionId: def.id,
          key: attr.key,
          required: attr.required ?? false,
          xdefault: attr.default ?? undefined,
          array: attr.array ?? false,
        }),
      );
    } else if (attr.kind === "url") {
      await ignoreExists(
        `${def.id}.${attr.key}`,
        databases.createUrlAttribute({
          databaseId,
          collectionId: def.id,
          key: attr.key,
          required: attr.required ?? false,
          xdefault: attr.default ?? undefined,
          array: attr.array ?? false,
        }),
      );
    } else if (attr.kind === "bool") {
      await ignoreExists(
        `${def.id}.${attr.key}`,
        databases.createBooleanAttribute({
          databaseId,
          collectionId: def.id,
          key: attr.key,
          required: attr.required ?? false,
          xdefault: attr.default ?? undefined,
          array: attr.array ?? false,
        }),
      );
    } else if (attr.kind === "int") {
      await ignoreExists(
        `${def.id}.${attr.key}`,
        databases.createIntegerAttribute({
          databaseId,
          collectionId: def.id,
          key: attr.key,
          required: attr.required ?? false,
          min: attr.min,
          max: attr.max,
          xdefault: attr.default,
          array: attr.array ?? false,
        }),
      );
    } else if (attr.kind === "double") {
      await ignoreExists(
        `${def.id}.${attr.key}`,
        databases.createDoubleAttribute({
          databaseId,
          collectionId: def.id,
          key: attr.key,
          required: attr.required ?? false,
          min: attr.min,
          max: attr.max,
          xdefault: attr.default,
          array: attr.array ?? false,
        }),
      );
    } else if (attr.kind === "datetime") {
      await ignoreExists(
        `${def.id}.${attr.key}`,
        databases.createDatetimeAttribute({
          databaseId,
          collectionId: def.id,
          key: attr.key,
          required: attr.required ?? false,
          xdefault: attr.default ?? undefined,
          array: attr.array ?? false,
        }),
      );
    } else if (attr.kind === "enum") {
      await ignoreExists(
        `${def.id}.${attr.key}`,
        databases.createEnumAttribute({
          databaseId,
          collectionId: def.id,
          key: attr.key,
          elements: attr.elements,
          required: attr.required ?? false,
          xdefault: attr.default ?? undefined,
          array: attr.array ?? false,
        }),
      );
    }
  }
}

const collections: CollectionDef[] = [
  {
    id: "users",
    name: "Users",
    permissions: authCrud,
    attributes: [
      { kind: "string", key: "authUserId", size: 128, required: true },
      { kind: "email", key: "email", required: true },
      { kind: "string", key: "displayName", size: 160, required: true },
      { kind: "enum", key: "role", elements: ["student", "tutor", "recruitment", "website_manager", "owner"], required: true, default: "student" },
      { kind: "string", key: "discordId", size: 128, required: false },
      { kind: "bool", key: "active", required: true, default: true },
    ],
  },
  {
    id: "students",
    name: "Students",
    permissions: authCrud,
    attributes: [
      { kind: "string", key: "authUserId", size: 128, required: true },
      { kind: "string", key: "displayName", size: 160, required: true },
      { kind: "email", key: "email", required: true },
      { kind: "string", key: "avatarUrl", size: 512, required: false },
      { kind: "bool", key: "active", required: true, default: true },
      { kind: "datetime", key: "createdAt", required: true, default: new Date().toISOString() },
    ],
  },
  {
    id: "tutor_profiles",
    name: "Tutor Profiles",
    permissions: publicRead,
    attributes: [
      { kind: "string", key: "slug", size: 96, required: true },
      { kind: "string", key: "displayName", size: 160, required: true },
      { kind: "string", key: "headline", size: 160, required: true },
      { kind: "text", key: "shortBio", required: true },
      { kind: "text", key: "fullBio", required: true },
      { kind: "string", key: "avatarInitials", size: 8, required: true },
      { kind: "string", key: "avatarUrl", size: 512, required: false },
      { kind: "double", key: "rating", required: true, default: 5 },
      { kind: "int", key: "reviewCount", required: true, default: 0 },
      { kind: "int", key: "hourlyRate", required: true, default: 40 },
      { kind: "int", key: "experienceYears", required: true, default: 0 },
      { kind: "string", key: "education", size: 255, required: false, array: true },
      { kind: "string", key: "subjects", size: 128, required: false, array: true },
      { kind: "string", key: "levels", size: 64, required: true, array: true },
      { kind: "string", key: "languages", size: 64, required: false, array: true },
      { kind: "string", key: "publicBadges", size: 64, required: false, array: true },
      { kind: "string", key: "responseTime", size: 128, required: true },
      { kind: "string", key: "availability", size: 256, required: true },
      { kind: "email", key: "contactEmail", required: false },
      { kind: "url", key: "contactUrl", required: false },
      { kind: "url", key: "inquiryUrl", required: false },
      { kind: "bool", key: "featured", required: true, default: false },
      { kind: "bool", key: "verified", required: true, default: false },
      { kind: "bool", key: "active", required: true, default: true },
    ],
  },
  {
    id: "ads",
    name: "Tutor Advertisements",
    permissions: publicRead,
    attributes: [
      { kind: "string", key: "title", size: 256, required: true },
      { kind: "text", key: "body", required: true },
      { kind: "string", key: "status", size: 32, required: false },
      { kind: "text", key: "Source", required: true },
      { kind: "text", key: "messageId", required: false },
      { kind: "text", key: "createdBy", required: false },
      { kind: "text", key: "description", required: true },
      { kind: "string", key: "subject", size: 128, required: true },
      { kind: "string", key: "level", size: 64, required: true },
      { kind: "datetime", key: "createdAt", required: true },
      { kind: "string", key: "tutorId", size: 128, required: false },
      { kind: "string", key: "teachingFormat", size: 32, required: false },
      { kind: "double", key: "monthlyPrice", required: false },
      { kind: "int", key: "price", required: false },
      { kind: "bool", key: "isFeatured", required: true, default: false },
      { kind: "bool", key: "isDeleted", required: true, default: false },
    ],
  },
  {
    id: "tutor_applications",
    name: "Tutor Applications",
    permissions: authCrud,
    attributes: [
      { kind: "email", key: "email", required: true },
      { kind: "string", key: "dateOfBirth", size: 32, required: true },
      { kind: "string", key: "phoneNumber", size: 64, required: true },
      { kind: "string", key: "discordUsername", size: 128, required: true },
      { kind: "url", key: "highestQualificationLink", required: false },
      { kind: "string", key: "highestQualificationFileId", size: 128, required: false },
      { kind: "string", key: "highestQualificationFileName", size: 255, required: false },
      { kind: "url", key: "highestQualificationFileUrl", required: false },
      { kind: "string", key: "countryOfResidence", size: 128, required: true },
      { kind: "string", key: "languagesSpoken", size: 64, required: true, array: true },
      { kind: "string", key: "subjectName", size: 160, required: true },
      { kind: "string", key: "subjectCode", size: 96, required: false },
      { kind: "string", key: "examBoard", size: 160, required: false },
      { kind: "string", key: "teachingLevel", size: 96, required: true },
      { kind: "text", key: "examResultSummary", required: true },
      { kind: "url", key: "resultDocumentLink", required: false },
      { kind: "string", key: "resultDocumentFileId", size: 128, required: false },
      { kind: "string", key: "resultDocumentFileName", size: 255, required: false },
      { kind: "url", key: "resultDocumentFileUrl", required: false },
      { kind: "text", key: "teachingExperience", required: true },
      { kind: "enum", key: "teachingFormat", elements: ["online", "in_person", "hybrid"], required: true, default: "online" },
      { kind: "double", key: "oneOnOneRateUsd", required: true, default: 0 },
      { kind: "double", key: "groupRateUsd", required: true, default: 0 },
      { kind: "int", key: "maxGroupStudents", required: true, default: 1 },
      { kind: "int", key: "weeklyClassesPerStudent", required: true, default: 1 },
      { kind: "string", key: "applicantUserId", size: 128, required: false },
      { kind: "string", key: "status", size: 32, required: true, default: "pending" },
      { kind: "text", key: "internalNotes", required: false },
      { kind: "datetime", key: "reviewedAt", required: false },
      { kind: "string", key: "reviewedBy", size: 128, required: false },
      { kind: "datetime", key: "createdAt", required: true },
      { kind: "datetime", key: "updatedAt", required: true },
      { kind: "bool", key: "isDeleted", required: true, default: false },
    ],
  },
  {
    id: "volunteer_applications",
    name: "Recruitment Applications",
    permissions: authCrud,
    attributes: [
      { kind: "string", key: "Full_name", size: 160, required: true },
      { kind: "string", key: "Discord_username", size: 160, required: true },
      { kind: "string", key: "Instagram_handle", size: 160, required: true },
      { kind: "email", key: "Email_address", required: true },
      { kind: "string", key: "Country_of_residence", size: 160, required: true },
      { kind: "string", key: "Languages_fluent_in", size: 64, required: true, array: true },
      { kind: "string", key: "Current_education_level", size: 160, required: true },
      { kind: "string", key: "Role_you_want_to_apply_for", size: 160, required: true },
      { kind: "text", key: "Reason_to_apply", required: true },
      { kind: "text", key: "Experience", required: true },
      { kind: "text", key: "Why_good_fit", required: true },
      { kind: "string", key: "applicantUserId", size: 128, required: false },
      { kind: "string", key: "status", size: 32, required: true, default: "pending" },
      { kind: "text", key: "internalNotes", required: false },
      { kind: "datetime", key: "reviewedAt", required: false },
      { kind: "string", key: "reviewedBy", size: 128, required: false },
      { kind: "datetime", key: "createdAt", required: true },
      { kind: "datetime", key: "updatedAt", required: true },
      { kind: "bool", key: "isDeleted", required: true, default: false },
    ],
  },
  {
    id: "subjects",
    name: "Subjects",
    permissions: publicRead,
    attributes: [
      { kind: "string", key: "name", size: 160, required: true },
      { kind: "string", key: "slug", size: 160, required: true },
      { kind: "string", key: "categoryId", size: 128, required: false },
      { kind: "bool", key: "active", required: true, default: true },
      { kind: "datetime", key: "createdAt", required: true },
    ],
  },
  {
    id: "subject_categories",
    name: "Subject Categories",
    permissions: publicRead,
    attributes: [
      { kind: "string", key: "name", size: 160, required: true },
      { kind: "string", key: "slug", size: 160, required: true },
      { kind: "text", key: "description", required: false },
      { kind: "int", key: "displayOrder", required: true, default: 0 },
      { kind: "bool", key: "active", required: true, default: true },
      { kind: "datetime", key: "createdAt", required: true },
    ],
  },
  {
    id: "tutor_reviews",
    name: "Reviews",
    permissions: publicRead,
    attributes: [
      { kind: "string", key: "authorName", size: 160, required: true },
      { kind: "string", key: "authorInitials", size: 8, required: true },
      { kind: "string", key: "title", size: 140, required: false },
      { kind: "text", key: "body", required: true },
      { kind: "int", key: "rating", required: true, min: 1, max: 5 },
      { kind: "bool", key: "isPublic", required: true, default: false },
      { kind: "enum", key: "status", elements: ["pending", "approved", "rejected"], required: true, default: "pending" },
      { kind: "int", key: "helpfulCount", required: true, default: 0 },
      { kind: "text", key: "response", required: false },
      { kind: "datetime", key: "responseAt", required: false },
      { kind: "string", key: "tutorId", size: 128, required: false },
      { kind: "string", key: "studentId", size: 128, required: false },
      { kind: "datetime", key: "createdAt", required: true },
      { kind: "bool", key: "isDeleted", required: true, default: false },
    ],
  },
  {
    id: "lessons",
    name: "Lessons",
    permissions: authCrud,
    attributes: [
      { kind: "string", key: "studentId", size: 128, required: true },
      { kind: "string", key: "tutorId", size: 128, required: true },
      { kind: "string", key: "subject", size: 160, required: false },
      { kind: "string", key: "academicLevel", size: 160, required: false },
      { kind: "datetime", key: "startsAt", required: true },
      { kind: "datetime", key: "endsAt", required: true },
      { kind: "enum", key: "status", elements: ["scheduled", "completed", "cancelled", "no_show"], required: true, default: "scheduled" },
      { kind: "text", key: "notes", required: false },
      { kind: "string", key: "createdBy", size: 128, required: false },
      { kind: "bool", key: "isDeleted", required: true, default: false },
      { kind: "datetime", key: "createdAt", required: true },
      { kind: "datetime", key: "updatedAt", required: true },
    ],
  },
  {
    id: "notifications",
    name: "Notifications",
    permissions: authCrud,
    attributes: [
      { kind: "string", key: "userId", size: 128, required: true },
      { kind: "string", key: "type", size: 64, required: true, default: "info" },
      { kind: "string", key: "title", size: 256, required: true },
      { kind: "text", key: "body", required: false },
      { kind: "url", key: "link", required: false },
      { kind: "bool", key: "isRead", required: true, default: false },
      { kind: "bool", key: "isDeleted", required: true, default: false },
      { kind: "datetime", key: "createdAt", required: true },
    ],
  },
  {
    id: "pages",
    name: "Pages",
    permissions: publicRead,
    attributes: [
      { kind: "string", key: "slug", size: 96, required: true },
      { kind: "string", key: "title", size: 160, required: true },
      { kind: "text", key: "content", required: true },
      { kind: "string", key: "seoTitle", size: 255, required: false },
      { kind: "text", key: "seoDescription", required: false },
      { kind: "enum", key: "status", elements: ["draft", "published", "archived"], required: true, default: "draft" },
      { kind: "datetime", key: "publishedAt", required: false },
      { kind: "bool", key: "isDeleted", required: true, default: false },
      { kind: "datetime", key: "updatedAt", required: true },
      { kind: "datetime", key: "createdAt", required: true },
    ],
  },
  {
    id: "homepage_content",
    name: "Homepage Content",
    permissions: publicRead,
    attributes: [
      { kind: "text", key: "heroHeadline", required: false },
      { kind: "text", key: "heroSubheadline", required: false },
      { kind: "string", key: "ctaPrimary", size: 160, required: false },
      { kind: "string", key: "ctaSecondary", size: 160, required: false },
      { kind: "text", key: "stats", required: false },
      { kind: "text", key: "featuredTutors", required: false },
      { kind: "text", key: "testimonials", required: false },
      { kind: "text", key: "promotionalSections", required: false },
      { kind: "text", key: "aboutMission", required: false },
      { kind: "text", key: "aboutVision", required: false },
      { kind: "text", key: "aboutValues", required: false },
      { kind: "text", key: "faqs", required: false },
      { kind: "bool", key: "isPublished", required: true, default: true },
      { kind: "datetime", key: "updatedAt", required: true },
      { kind: "datetime", key: "createdAt", required: true },
    ],
  },
  {
    id: "audit_logs",
    name: "Audit Logs",
    permissions: managerCrud,
    attributes: [
      { kind: "string", key: "action", size: 160, required: true },
      { kind: "string", key: "actorId", size: 128, required: false },
      { kind: "text", key: "metadata", required: false },
      { kind: "datetime", key: "createdAt", required: true },
    ],
  },
  {
    id: "platform_settings",
    name: "Platform Settings",
    permissions: managerCrud,
    attributes: [
      { kind: "string", key: "key", size: 160, required: true },
      { kind: "text", key: "value", required: false },
      { kind: "string", key: "updatedBy", size: 128, required: false },
      { kind: "datetime", key: "updatedAt", required: true },
      { kind: "datetime", key: "createdAt", required: true },
    ],
  },
  {
    id: "notification_preferences",
    name: "Notification Preferences",
    permissions: authCrud,
    attributes: [
      { kind: "string", key: "userId", size: 128, required: true },
      { kind: "bool", key: "emailNotifications", required: true, default: true },
      { kind: "bool", key: "pushNotifications", required: true, default: true },
      { kind: "bool", key: "lessonReminders", required: true, default: true },
      { kind: "bool", key: "announcements", required: true, default: true },
      { kind: "bool", key: "marketing", required: true, default: false },
      { kind: "datetime", key: "updatedAt", required: true },
      { kind: "datetime", key: "createdAt", required: true },
    ],
  },
  {
    id: "discord_links",
    name: "Discord Links",
    permissions: authCrud,
    attributes: [
      { kind: "string", key: "userId", size: 128, required: true },
      { kind: "string", key: "discordId", size: 128, required: true },
      { kind: "string", key: "discordUsername", size: 160, required: true },
      { kind: "datetime", key: "linkedAt", required: true },
      { kind: "datetime", key: "updatedAt", required: true },
    ],
  },
  {
    id: "schedules",
    name: "Schedules",
    permissions: authCrud,
    attributes: [
      { kind: "string", key: "tutorId", size: 128, required: true },
      { kind: "int", key: "dayOfWeek", required: true, min: 0, max: 6 },
      { kind: "string", key: "startTime", size: 16, required: true },
      { kind: "string", key: "endTime", size: 16, required: true },
      { kind: "string", key: "timezone", size: 64, required: true },
      { kind: "bool", key: "isActive", required: true, default: true },
      { kind: "datetime", key: "createdAt", required: true },
    ],
  },
  {
    id: "student_tutor_assignments",
    name: "Student Tutor Assignments",
    permissions: authCrud,
    attributes: [
      { kind: "string", key: "studentId", size: 128, required: true },
      { kind: "string", key: "tutorId", size: 128, required: true },
      { kind: "int", key: "remainingClasses", required: true, default: 0 },
      { kind: "bool", key: "isActive", required: true, default: true },
      { kind: "datetime", key: "createdAt", required: true },
    ],
  },
];

const buckets = [
  { id: "profile-media", name: "Profile Media" },
  { id: "application-documents", name: "Application Documents" },
  { id: "site-assets", name: "Site Assets" },
];

async function ensureStorage() {
  for (const bucket of buckets) {
    await ignoreExists(`bucket ${bucket.id}`, storage.createBucket({
      bucketId: bucket.id,
      name: bucket.name,
      permissions: [Permission.read(Role.any()), Permission.create(Role.users()), Permission.update(Role.users()), Permission.delete(Role.users())],
      fileSecurity: false,
      enabled: true,
    }));
  }
}

async function main() {
  console.log(`Setting up Appwrite database ${databaseId} in ${endpoint}...`);
  await ensureDatabase();
  for (const collection of collections) {
    console.log(`Ensuring collection: ${collection.id}`);
    await ensureCollection(collection);
  }
  await ensureStorage();
  console.log("Appwrite setup complete.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
