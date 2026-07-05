export const MODULE_ID = "cybercall";
export const SOCKET_NAME = `module.${MODULE_ID}`;
export const TEMPLATE_PATH = `modules/${MODULE_ID}/templates/cybercall.hbs`;
export const COMPOSER_TEMPLATE_PATH = `modules/${MODULE_ID}/templates/cybercall-composer.hbs`;
export const CONTACTS_TEMPLATE_PATH = `modules/${MODULE_ID}/templates/cybercall-contacts.hbs`;
export const MESSAGES_TEMPLATE_PATH = `modules/${MODULE_ID}/templates/cybercall-messages.hbs`;
export const PHONE_TEMPLATE_PATH = `modules/${MODULE_ID}/templates/cybercall-phone.hbs`;
export const MESSAGE_FLAG_KIND = "phoneMessage";
export const MESSAGE_SCHEMA_VERSION = 1;

export const RINGTONE_CHOICES = {
  "": "Silent",
  [`modules/${MODULE_ID}/audio/Ringtone1.ogg`]: "Ringtone 1",
  [`modules/${MODULE_ID}/audio/Ringtone2.ogg`]: "Ringtone 2",
  [`modules/${MODULE_ID}/audio/Ringtone3.ogg`]: "Ringtone 3"
};
