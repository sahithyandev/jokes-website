// types and values needed by this app
import { category as Category, flag as Flag } from "sv443-joke-api";

export const AVAILABLE: {
    category: Category[];
    flag: string[];
} = {
    category: [
        "Programming",
        "Miscellaneous",
        "Dark",
        "Pun",
        "Spooky",
        "Christmas",
    ],
    flag: ["NSFW", "Religious", "Political", "Sexist"],
};

export type JokeObject = {
    type: "" | "single" | "twopart";
    content?: string;
    category: Category | "";
    setup?: string;
    delivery?: string;
    flags?: string[];
};
export type FormValues = {
    categoryArray: Set<Category>;
    flagArray: Set<Flag>;
    searchString: string;
};

export type Error = {
    error: Boolean;
    internalError: Boolean;
    code: number;
    message: string;
    causedBy: string[];
    additionalInfo: string;
    timestamp: number;
};

export const capitalize = (str: string) =>
    str[0].toUpperCase() + str.slice(1).toLowerCase();
