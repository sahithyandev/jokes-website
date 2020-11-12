// types and values needed by this app
import {
    Category,
    Flag,
    AVAILABLE_CATEGORIES,
    AVAILABLE_FLAGS,
} from "sv443-joke-api";

export const capitalize = (str: string): string =>
    str[0].toUpperCase() + str.slice(1).toLowerCase();

export const AVAILABLE: {
    category: Category[];
    flag: string[];
} = {
    category: AVAILABLE_CATEGORIES as Category[],
    flag: AVAILABLE_FLAGS?.map(capitalize).map((flag) => {
        const specials = {
            Nsfw: "NSFW",
        };
        // @ts-ignore
        return Object.keys(specials).includes(flag) ? specials[flag] : flag;
    }),
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
