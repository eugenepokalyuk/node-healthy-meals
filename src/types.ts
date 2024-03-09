export const START_TEST: "START_TEST" = "START_TEST";

export const SET_GENDER_MALE: "SET_GENDER_MALE" = "SET_GENDER_MALE";
export const SET_GENDER_FEMALE: "SET_GENDER_FEMALE" = "SET_GENDER_FEMALE";

export const GOAL_LOSE_WEIGHT: "GOAL_LOSE_WEIGHT" = "GOAL_LOSE_WEIGHT";
export const GOAL_MAINTAIN_WEIGHT: "GOAL_MAINTAIN_WEIGHT" = "GOAL_MAINTAIN_WEIGHT";
export const GOAL_GAIN_WEIGHT: "GOAL_GAIN_WEIGHT" = "GOAL_GAIN_WEIGHT";

export const ACTIVITY_NONE: "ACTIVITY_NONE" = "ACTIVITY_NONE";
export const ACTIVITY_MEDIUM: "ACTIVITY_MEDIUM" = "ACTIVITY_MEDIUM";
export const ACTIVITY_HIGH: "ACTIVITY_HIGH" = "ACTIVITY_HIGH";
export const ACTIVITY_VERY_HIGH: "ACTIVITY_VERY_HIGH" = "ACTIVITY_VERY_HIGH";

export const SEND_PHOTO: "SEND_PHOTO" = "SEND_PHOTO";
export const EDIT_DATA: "EDIT_DATA" = "EDIT_DATA";

export const CHANGE_GENDER: "CHANGE_GENDER" = "CHANGE_GENDER";
export const CHANGE_GOAL: "CHANGE_GOAL" = "CHANGE_GOAL";
export const CHANGE_AGE: "CHANGE_AGE" = "CHANGE_AGE";
export const CHANGE_WEIGHT: "CHANGE_WEIGHT" = "CHANGE_WEIGHT";
export const CHANGE_HEIGHT: "CHANGE_HEIGHT" = "CHANGE_HEIGHT";
export const CHANGE_ACTIVITY: "CHANGE_ACTIVITY" = "CHANGE_ACTIVITY";
export const CHANGE_HEALTH_ISSUES: "CHANGE_HEALTH_ISSUES" = "CHANGE_HEALTH_ISSUES";
export const GO_BACK: "GO_BACK" = "GO_BACK";

export interface UserState {
    step: number;
    gender?: string;
    goal?: string;
    age?: number;
    weight?: number;
    height?: number;
    activity?: string;
    healthIssues?: string;
}