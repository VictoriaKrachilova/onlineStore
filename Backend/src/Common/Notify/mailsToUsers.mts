import { conf } from "../../conf.mjs";
import { RestorePasswordDto } from "./dto/sendRestorePasswordLink.dto.mjs";
import { sendMail } from "./email.mjs";

// TO DO
export async function sendRestorePasswordLink (data : RestorePasswordDto) {
};

export async function sendRegisterActivateLink (data : RestorePasswordDto) { // TO DO
};

export async function sendEmailActivateLink (data : RestorePasswordDto) { // TO DO
};
