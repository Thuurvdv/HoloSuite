export const MODULE_ID = "cybercall";
export const SOCKET_NAME = `module.${MODULE_ID}`;
export const TEMPLATE_PATH = `modules/${MODULE_ID}/templates/cybercall.hbs`;
export const COMPOSER_TEMPLATE_PATH = `modules/${MODULE_ID}/templates/cybercall-composer.hbs`;
export const CONTACTS_TEMPLATE_PATH = `modules/${MODULE_ID}/templates/cybercall-contacts.hbs`;

export const RINGTONE_CHOICES = {
  "": "Silent",
  [`modules/${MODULE_ID}/audio/Ringtone1.ogg`]: "Ringtone 1",
  [`modules/${MODULE_ID}/audio/Ringtone2.ogg`]: "Ringtone 2",
  [`modules/${MODULE_ID}/audio/Ringtone3.ogg`]: "Ringtone 3"
};
