// Vercel Serverless Function: Motor de Sincronización en Tiempo Real de Estudiantes
// Universidad Aztlán - Redes de Computadoras (Clave 634)

let cachedStudents = null;

module.exports = async function handler(req, res) {
  // Cabeceras CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      let incoming = req.body;
      if (typeof incoming === 'string') {
        try { incoming = JSON.parse(incoming); } catch (e) {}
      }

      if (!incoming) {
        return res.status(400).json({ error: 'No se recibieron datos para sincronizar' });
      }

      const incomingList = Array.isArray(incoming) ? incoming : [incoming];

      if (!cachedStudents) {
        cachedStudents = incomingList;
      } else {
        // Combinar datos entrantes con el estado en memoria
        incomingList.forEach(inSt => {
          if (!inSt || !inSt.username) return;
          const idx = cachedStudents.findIndex(s => s.username === inSt.username);
          if (idx === -1) {
            cachedStudents.push(inSt);
          } else {
            const current = cachedStudents[idx];

            // Combinar ejercicios resueltos
            const exSet = new Set([
              ...(current.completedExercises || []),
              ...(inSt.completedExercises || [])
            ]);
            current.completedExercises = Array.from(exSet);

            // Combinar cuestionarios (mantener puntaje más alto)
            current.passedQuizzes = current.passedQuizzes || {};
            if (inSt.passedQuizzes) {
              Object.keys(inSt.passedQuizzes).forEach(k => {
                const curSc = current.passedQuizzes[k] || 0;
                const newSc = inSt.passedQuizzes[k] || 0;
                current.passedQuizzes[k] = Math.max(curSc, newSc);
              });
            }

            // Combinar laboratorios acreditados
            current.passedLabs = {
              ...(current.passedLabs || {}),
              ...(inSt.passedLabs || {})
            };

            // Combinar examen final
            if (inSt.finalExam) {
              if (!current.finalExam || inSt.finalExam.score > current.finalExam.score) {
                current.finalExam = inSt.finalExam;
              }
            }

            // Actualizar último acceso
            if (inSt.lastAccess && inSt.lastAccess !== 'Pendiente') {
              current.lastAccess = inSt.lastAccess;
            }

            // Combinar bitácora de actividad (últimas 30)
            const logMap = new Map();
            (current.activityLog || []).forEach(item => {
              logMap.set(`${item.timestamp}_${item.action}`, item);
            });
            (inSt.activityLog || []).forEach(item => {
              logMap.set(`${item.timestamp}_${item.action}`, item);
            });
            current.activityLog = Array.from(logMap.values()).slice(0, 30);
          }
        });
      }

      return res.status(200).json({
        status: 'ok',
        count: cachedStudents.length,
        students: cachedStudents
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // GET: Retornar estado global actual
  return res.status(200).json({
    status: 'ok',
    students: cachedStudents || null
  });
};
