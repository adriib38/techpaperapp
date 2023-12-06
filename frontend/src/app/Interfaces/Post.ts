export interface Post {
    id: string;
    title: string;
    content: string;
    created_at: string;
    author_id: string;
    summary: string;
    username?: string;
    is_author?: number;
    verified?: boolean;
    time_ago?: string;
    categories?: string[]; // Opcional, dependiendo de tus necesidades
    likes?: number; // Opcional, dependiendo de tus necesidades
}
  