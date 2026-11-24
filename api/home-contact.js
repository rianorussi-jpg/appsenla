const {sendContact} = require("./contact");

module.exports = (req, res) => {
  const {nombre, telefono, correo, tema, mensaje, turnstileToken} = req.body || {};
  const fields = [nombre, telefono, correo, tema, mensaje];
  if (req.method === "POST" && (
    fields.some(value => typeof value !== "string" || !value.trim()) ||
    !/^[^\s@]+@[^\s@]+$/.test(correo) ||
    !/^\+?[0-9 ().-]+$/.test(telefono) ||
    telefono.replace(/\D/g, "").length < 7 ||
    telefono.replace(/\D/g, "").length > 15 ||
    correo.length > 254 || telefono.length > 32
  )) {
    return res.status(400).json({success: false, error: "Revisa los datos de contacto."});
  }
  req.body = {
    nombre,
    contacto: [telefono, correo].filter(Boolean).join(" · "),
    tipo: tema,
    idea: mensaje,
    turnstileToken
  };
  return sendContact(req, res, true);
};
