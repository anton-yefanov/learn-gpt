interface User {
  id: string;
  email: string;
  name?: string;
}

interface UserStats {
  userId: string;
  lives: number;
  courses: UsersCourse[];
}

interface UsersCourse {
  id: string;
  technologyTitle: string;
  experienceLevel: number;
  streak: {
    date: Date;
    isTrained: boolean;
  }[];
}
