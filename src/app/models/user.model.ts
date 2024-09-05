export interface User {
    id: number;
    email: string;
    name: string;
    role: string;
    photo: string;
    school: {
        id: number,
        name: string
    };
}
