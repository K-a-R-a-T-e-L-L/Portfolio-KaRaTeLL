//authorization/login.tsx
export interface CustomError extends Error {
    status?: number;
};

export type TokenDecodeType = {
    email: string,
    exp: number,
    iat: number,
    number: string,
    role: string,
    sub: number
};

export type WarnInputsTypeLogin = {
    login: string,
    password: string
};


//authorization/login.tsx
export type WarnInputsTypeRegister = {
    email: string,
    number: string,
    password: string
};


//project/[i].tsx
export type ProjectType = {
    id: number,
    name: string,
    link: string,
    description: string,
    positioningIcon: {
        x: number,
        y: number
    }[],
    color: string,
    URLImages: {
        img: string[],
        icon: string[]
    },
    skills: string[],
    view: boolean[],
};

export type ArrayImagesType = {
    view: boolean,
    shift: number,
    path: string
};


//adding/project.tsx
export type ValuesInputsType = {
    name: string,
    link: string,
    description: string,
    positioningIcon: {
        x: number,
        y: number
    }[],
    number: string,
    color: string,
    skills: string[],
    images: { img: File[], icon: File[] } | null,
    view: boolean[],
};

export type ValuesInputsImagesType = {
    img: File[],
    icon: File[]
};

export type ArrayURLImagesType = {
    img: string[],
    icon: string[]
}

export type DataProjectCardType = {
    id: number,
    name: string,
    link: string,
    description: string,
    positioningIcon: {
        x: number,
        y: number
    }[],
    color: string,
    URLImages: {
        img: string[],
        icon: string[]
    },
    skills: string[],
    view: boolean[],
}
