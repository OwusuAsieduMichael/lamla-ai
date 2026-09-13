import type {
  AuthorizationStatus,
  ResourceKind,
  ResourceStatus,
  Semester,
  UserRole,
} from "@/lib/academic/enums";
import type { IngestionJobStatus } from "@/lib/ingestion/enums";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Timestamps = {
  created_at: string;
  updated_at: string;
};

type InstitutionRow = {
  id: string;
  slug: string;
  name: string;
} & Timestamps;

type CollegeRow = {
  id: string;
  institution_id: string;
  slug: string;
  name: string;
} & Timestamps;

type FacultyRow = {
  id: string;
  college_id: string;
  slug: string;
  name: string;
} & Timestamps;

type DepartmentRow = {
  id: string;
  faculty_id: string;
  slug: string;
  name: string;
} & Timestamps;

type ProgrammeRow = {
  id: string;
  department_id: string;
  slug: string;
  name: string;
} & Timestamps;

type ProfileRow = {
  id: string;
  display_name: string | null;
  role: UserRole;
  programme_id: string | null;
} & Timestamps;

type CourseRow = {
  id: string;
  programme_id: string;
  code: string;
  title: string;
  year_level: number;
  semester: Semester;
  credits: number | null;
  description: string | null;
} & Timestamps;

type TopicRow = {
  id: string;
  course_id: string;
  parent_id: string | null;
  title: string;
  sort_order: number;
} & Timestamps;

type ConceptRow = {
  id: string;
  course_id: string;
  topic_id: string;
  title: string;
  description: string | null;
  sort_order: number;
} & Timestamps;

type AcademicResourceRow = {
  id: string;
  course_id: string;
  topic_id: string | null;
  concept_id: string | null;
  kind: ResourceKind;
  status: ResourceStatus;
  title: string;
  description: string | null;
  source_attribution: string;
  academic_year: string | null;
  storage_bucket: string;
  storage_path: string | null;
  mime_type: string | null;
  byte_size: number | null;
  checksum_sha256: string | null;
  created_by: string | null;
  license: string | null;
  authorization_status: AuthorizationStatus;
  authorized_by: string | null;
  authorized_at: string | null;
  authorization_note: string | null;
  manifest_id: string | null;
} & Timestamps;

type PastQuestionRow = {
  id: string;
  course_id: string;
  resource_id: string | null;
  status: ResourceStatus;
  title: string;
  academic_year: string | null;
  semester: Semester | null;
  source_attribution: string;
} & Timestamps;

type IngestionJobRow = {
  id: string;
  manifest_id: string | null;
  resource_id: string | null;
  status: IngestionJobStatus;
  skip_reason: string | null;
  error_message: string | null;
  mime_type: string | null;
  extracted_char_count: number | null;
  chunk_count: number | null;
  started_at: string | null;
  finished_at: string | null;
} & Timestamps;

type ResourceChunkRow = {
  id: string;
  job_id: string;
  resource_id: string | null;
  chunk_index: number;
  content: string;
  token_count: number | null;
  embedding: number[] | null;
  importance_score: number | null;
} & Timestamps;

type LearningEventRow = {
  id: string;
  profile_id: string | null;
  resource_id: string | null;
  kind: string;
  created_at: string;
};

type WorkspaceChannel = "text" | "voice" | "image";

type ConversationRow = {
  id: string;
  profile_id: string;
  title: string;
} & Timestamps;

type ConversationMessageRow = {
  id: string;
  conversation_id: string;
  profile_id: string;
  role: "user" | "assistant";
  content: string;
  channel: WorkspaceChannel;
  mode: string;
  refused: boolean;
  reason: string | null;
  created_at: string;
};

type ConversationSourceRow = {
  id: string;
  message_id: string;
  chunk_id: string | null;
  source_title: string;
  source_attribution: string;
  excerpt: string | null;
  created_at: string;
};

type SavedItemRow = {
  id: string;
  profile_id: string;
  kind: "response" | "resource";
  title: string;
  body: string;
  resource_id: string | null;
  conversation_message_id: string | null;
  created_at: string;
};

type QueryHistoryRow = {
  id: string;
  profile_id: string;
  query: string;
  channel: WorkspaceChannel;
  mode: string;
  refused: boolean;
  created_at: string;
};

type PastQuestionItemRow = {
  id: string;
  past_question_id: string;
  course_id: string;
  topic_id: string | null;
  concept_id: string | null;
  prompt_text: string | null;
  marks: number | null;
  sort_order: number;
} & Timestamps;

/**
 * Typed Supabase schema for the KNUST web pilot.
 * Replace this file with `supabase gen types` once a hosted project exists
 * and the migrations have been applied. Keep the generated output in this path.
 */
export type Database = {
  public: {
    Tables: {
      institutions: {
        Row: InstitutionRow;
        Insert: {
          id?: string;
          slug: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<InstitutionRow>;
        Relationships: [];
      };
      colleges: {
        Row: CollegeRow;
        Insert: {
          id?: string;
          institution_id: string;
          slug: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<CollegeRow>;
        Relationships: [
          {
            foreignKeyName: "colleges_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
        ];
      };
      faculties: {
        Row: FacultyRow;
        Insert: {
          id?: string;
          college_id: string;
          slug: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<FacultyRow>;
        Relationships: [
          {
            foreignKeyName: "faculties_college_id_fkey";
            columns: ["college_id"];
            isOneToOne: false;
            referencedRelation: "colleges";
            referencedColumns: ["id"];
          },
        ];
      };
      departments: {
        Row: DepartmentRow;
        Insert: {
          id?: string;
          faculty_id: string;
          slug: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<DepartmentRow>;
        Relationships: [
          {
            foreignKeyName: "departments_faculty_id_fkey";
            columns: ["faculty_id"];
            isOneToOne: false;
            referencedRelation: "faculties";
            referencedColumns: ["id"];
          },
        ];
      };
      programmes: {
        Row: ProgrammeRow;
        Insert: {
          id?: string;
          department_id: string;
          slug: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<ProgrammeRow>;
        Relationships: [
          {
            foreignKeyName: "programmes_department_id_fkey";
            columns: ["department_id"];
            isOneToOne: false;
            referencedRelation: "departments";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: ProfileRow;
        Insert: {
          id: string;
          display_name?: string | null;
          role?: UserRole;
          programme_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<ProfileRow, "id">>;
        Relationships: [
          {
            foreignKeyName: "profiles_programme_id_fkey";
            columns: ["programme_id"];
            isOneToOne: false;
            referencedRelation: "programmes";
            referencedColumns: ["id"];
          },
        ];
      };
      courses: {
        Row: CourseRow;
        Insert: {
          id?: string;
          programme_id: string;
          code: string;
          title: string;
          year_level: number;
          semester: Semester;
          credits?: number | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<CourseRow>;
        Relationships: [
          {
            foreignKeyName: "courses_programme_id_fkey";
            columns: ["programme_id"];
            isOneToOne: false;
            referencedRelation: "programmes";
            referencedColumns: ["id"];
          },
        ];
      };
      topics: {
        Row: TopicRow;
        Insert: {
          id?: string;
          course_id: string;
          parent_id?: string | null;
          title: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<TopicRow>;
        Relationships: [
          {
            foreignKeyName: "topics_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      concepts: {
        Row: ConceptRow;
        Insert: {
          id?: string;
          course_id: string;
          topic_id: string;
          title: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<ConceptRow>;
        Relationships: [
          {
            foreignKeyName: "concepts_topic_id_fkey";
            columns: ["topic_id"];
            isOneToOne: false;
            referencedRelation: "topics";
            referencedColumns: ["id"];
          },
        ];
      };
      academic_resources: {
        Row: AcademicResourceRow;
        Insert: {
          id?: string;
          course_id: string;
          topic_id?: string | null;
          concept_id?: string | null;
          kind: ResourceKind;
          status?: ResourceStatus;
          title: string;
          description?: string | null;
          source_attribution: string;
          academic_year?: string | null;
          storage_bucket?: string;
          storage_path?: string | null;
          mime_type?: string | null;
          byte_size?: number | null;
          checksum_sha256?: string | null;
          created_by?: string | null;
          license?: string | null;
          authorization_status?: AuthorizationStatus;
          authorized_by?: string | null;
          authorized_at?: string | null;
          authorization_note?: string | null;
          manifest_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<AcademicResourceRow>;
        Relationships: [
          {
            foreignKeyName: "academic_resources_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      past_questions: {
        Row: PastQuestionRow;
        Insert: {
          id?: string;
          course_id: string;
          resource_id?: string | null;
          status?: ResourceStatus;
          title: string;
          academic_year?: string | null;
          semester?: Semester | null;
          source_attribution: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<PastQuestionRow>;
        Relationships: [
          {
            foreignKeyName: "past_questions_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      past_question_items: {
        Row: PastQuestionItemRow;
        Insert: {
          id?: string;
          past_question_id: string;
          course_id: string;
          topic_id?: string | null;
          concept_id?: string | null;
          prompt_text?: string | null;
          marks?: number | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<PastQuestionItemRow>;
        Relationships: [
          {
            foreignKeyName: "past_question_items_past_question_id_fkey";
            columns: ["past_question_id"];
            isOneToOne: false;
            referencedRelation: "past_questions";
            referencedColumns: ["id"];
          },
        ];
      };
      ingestion_jobs: {
        Row: IngestionJobRow;
        Insert: {
          id?: string;
          manifest_id?: string | null;
          resource_id?: string | null;
          status?: IngestionJobStatus;
          skip_reason?: string | null;
          error_message?: string | null;
          mime_type?: string | null;
          extracted_char_count?: number | null;
          chunk_count?: number | null;
          started_at?: string | null;
          finished_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<IngestionJobRow>;
        Relationships: [
          {
            foreignKeyName: "ingestion_jobs_resource_id_fkey";
            columns: ["resource_id"];
            isOneToOne: false;
            referencedRelation: "academic_resources";
            referencedColumns: ["id"];
          },
        ];
      };
      resource_chunks: {
        Row: ResourceChunkRow;
        Insert: {
          id?: string;
          job_id: string;
          resource_id?: string | null;
          chunk_index: number;
          content: string;
          token_count?: number | null;
          embedding?: number[] | null;
          importance_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<ResourceChunkRow>;
        Relationships: [
          {
            foreignKeyName: "resource_chunks_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "ingestion_jobs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "resource_chunks_resource_id_fkey";
            columns: ["resource_id"];
            isOneToOne: false;
            referencedRelation: "academic_resources";
            referencedColumns: ["id"];
          },
        ];
      };
      learning_events: {
        Row: LearningEventRow;
        Insert: {
          id?: string;
          profile_id?: string | null;
          resource_id?: string | null;
          kind: string;
          created_at?: string;
        };
        Update: Partial<LearningEventRow>;
        Relationships: [
          {
            foreignKeyName: "learning_events_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "learning_events_resource_id_fkey";
            columns: ["resource_id"];
            isOneToOne: false;
            referencedRelation: "academic_resources";
            referencedColumns: ["id"];
          },
        ];
      };
      conversations: {
        Row: ConversationRow;
        Insert: {
          id?: string;
          profile_id: string;
          title: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<ConversationRow>;
        Relationships: [
          {
            foreignKeyName: "conversations_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      conversation_messages: {
        Row: ConversationMessageRow;
        Insert: {
          id?: string;
          conversation_id: string;
          profile_id: string;
          role: "user" | "assistant";
          content: string;
          channel?: WorkspaceChannel;
          mode?: string;
          refused?: boolean;
          reason?: string | null;
          created_at?: string;
        };
        Update: Partial<ConversationMessageRow>;
        Relationships: [
          {
            foreignKeyName: "conversation_messages_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          },
        ];
      };
      conversation_sources: {
        Row: ConversationSourceRow;
        Insert: {
          id?: string;
          message_id: string;
          chunk_id?: string | null;
          source_title: string;
          source_attribution: string;
          excerpt?: string | null;
          created_at?: string;
        };
        Update: Partial<ConversationSourceRow>;
        Relationships: [
          {
            foreignKeyName: "conversation_sources_message_id_fkey";
            columns: ["message_id"];
            isOneToOne: false;
            referencedRelation: "conversation_messages";
            referencedColumns: ["id"];
          },
        ];
      };
      saved_items: {
        Row: SavedItemRow;
        Insert: {
          id?: string;
          profile_id: string;
          kind: "response" | "resource";
          title: string;
          body: string;
          resource_id?: string | null;
          conversation_message_id?: string | null;
          created_at?: string;
        };
        Update: Partial<SavedItemRow>;
        Relationships: [
          {
            foreignKeyName: "saved_items_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      query_history: {
        Row: QueryHistoryRow;
        Insert: {
          id?: string;
          profile_id: string;
          query: string;
          channel?: WorkspaceChannel;
          mode?: string;
          refused?: boolean;
          created_at?: string;
        };
        Update: Partial<QueryHistoryRow>;
        Relationships: [
          {
            foreignKeyName: "query_history_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_staff: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      match_resource_chunks: {
        Args: {
          query_embedding: number[];
          match_count?: number;
        };
        Returns: {
          id: string;
          content: string;
          resource_id: string | null;
          importance_score: number | null;
          similarity: number;
        }[];
      };
    };
    Enums: {
      user_role: UserRole;
      semester: Semester;
      resource_kind: ResourceKind;
      resource_status: ResourceStatus;
      authorization_status: AuthorizationStatus;
      ingestion_job_status: IngestionJobStatus;
      workspace_channel: WorkspaceChannel;
    };
    CompositeTypes: Record<string, never>;
  };
};

export type PublicTable = keyof Database["public"]["Tables"];
export type TableRow<T extends PublicTable> =
  Database["public"]["Tables"][T]["Row"];
export type TableInsert<T extends PublicTable> =
  Database["public"]["Tables"][T]["Insert"];
export type TableUpdate<T extends PublicTable> =
  Database["public"]["Tables"][T]["Update"];
