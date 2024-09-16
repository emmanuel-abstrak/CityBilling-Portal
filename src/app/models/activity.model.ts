import { User } from "./user.model";

export interface Activity {
    id: number;
    action: string;
    before: string;
    after: string;
    createdAt: string;
    actor: User;
}
