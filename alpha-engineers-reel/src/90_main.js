/* =====================================================================
   seek(t): the whole film is this one function of time
   ===================================================================== */
window.DUR = DUR;
window.seek = function (t) {
  t = ((t % DUR) + DUR) % DUR;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  ctx.imageSmoothingEnabled = true; ctx.textBaseline = 'alphabetic'; ctx.setLineDash([]);
  if (t < bt(9)) TYPE.drawHook(t);
  else if (t < bt(25)) HW.draw(t);
  else if (t < bt(41)) SW.draw(t);
  else if (t < bt(57)) GAME.draw(t);
  else { ctx.fillStyle = C.k; ctx.fillRect(0, 0, W, H); TYPE.drawEnd(t); }
};
window.ready = (async () => {
  await Promise.all([document.fonts.load(F(900, 100)), document.fonts.load(F(700, 100)), document.fonts.load(F(500, 100))]);
  await document.fonts.ready;
  TYPE.init(); SW.init(); GAME.init();
  window.seek(0);
  return true;
})();
