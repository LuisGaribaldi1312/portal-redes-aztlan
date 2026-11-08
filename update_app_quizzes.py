# -*- coding: utf-8 -*-
import json

with open("quizzes_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

quizzes = data["quizzes"]
final_exam = data["final_exam"]

with open("app.js", "r", encoding="utf-8") as f:
    app_js = f.read()

# Reemplazar COURSE_QUIZZES y FINAL_EXAM_QUESTIONS
new_quizzes_code = "const COURSE_QUIZZES = " + json.dumps(quizzes, ensure_ascii=False, indent=2) + ";\n\n"
new_final_code = "const FINAL_EXAM_QUESTIONS = " + json.dumps(final_exam, ensure_ascii=False, indent=2) + ";\n"

# Ubicar dónde inicia COURSE_QUIZZES y dónde termina FINAL_EXAM_QUESTIONS
start_str = "const COURSE_QUIZZES = {"
end_str = "const App = {"

idx_start = app_js.find(start_str)
idx_end = app_js.find(end_str)

if idx_start == -1 or idx_end == -1:
    print("Error: No se encontraron los delimitadores en app.js")
    exit(1)

app_js_updated = app_js[:idx_start] + new_quizzes_code + new_final_code + "\n// App Principal\n" + app_js[idx_end:]

# Reemplazar checkUnitQuizAnswer y recalcUnitScore para arreglar conteo
old_check_logic = """    if (selectedIdx === qItem.answer) {
      elem.classList.add('correct');
      if (expBox) {
        expBox.style.display = 'block';
        expBox.style.borderLeftColor = '#10b981';
        expBox.innerHTML = `<strong style="color: #10b981;">✓ ¡Correcto!</strong> ${qItem.why}`;
      }
    } else {
      elem.classList.add('incorrect');
      options[qItem.answer].classList.add('correct');
      if (expBox) {
        expBox.style.display = 'block';
        expBox.style.borderLeftColor = '#ef4444';
        expBox.innerHTML = `<strong style="color: #ef4444;">✗ Incorrecto.</strong> ${qItem.why}`;
      }
    }

    // Actualizar score
    this.recalcUnitScore(unitKey);
  },

  recalcUnitScore(unitKey) {
    const container = document.getElementById(`quiz-${unitKey}-container`);
    if (!container) return;
    const correctCount = container.querySelectorAll('.quiz-option.correct:not(.incorrect)').length;
    const totalQuestions = COURSE_QUIZZES[unitKey].length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);

    this.state.scores[unitKey] = percentage;
    this.saveState();

    const scoreText = document.getElementById(`score-text-${unitKey}`);
    if (scoreText) scoreText.innerText = `Puntaje: ${percentage}%`;"""

new_check_logic = """    if (selectedIdx === qItem.answer) {
      elem.classList.add('correct', 'user-chosen-correct');
      if (expBox) {
        expBox.style.display = 'block';
        expBox.style.borderLeftColor = '#10b981';
        expBox.innerHTML = `<strong style="color: #10b981;">✓ ¡Correcto!</strong> ${qItem.why}`;
      }
    } else {
      elem.classList.add('incorrect', 'user-chosen-incorrect');
      options[qItem.answer].classList.add('correct');
      if (expBox) {
        expBox.style.display = 'block';
        expBox.style.borderLeftColor = '#ef4444';
        expBox.innerHTML = `<strong style="color: #ef4444;">✗ Incorrecto.</strong> La opción correcta es la ${String.fromCharCode(65 + qItem.answer)}. ${qItem.why}`;
      }
    }

    // Actualizar score
    this.recalcUnitScore(unitKey);
  },

  recalcUnitScore(unitKey) {
    const container = document.getElementById(`quiz-${unitKey}-container`);
    if (!container) return;
    const correctCount = container.querySelectorAll('.quiz-option.user-chosen-correct').length;
    const totalQuestions = COURSE_QUIZZES[unitKey].length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);

    this.state.scores[unitKey] = percentage;
    this.saveState();

    const scoreText = document.getElementById(`score-text-${unitKey}`);
    if (scoreText) scoreText.innerText = `Puntaje: ${percentage}% (${correctCount} de ${totalQuestions} reactivos)`;"""

if old_check_logic in app_js_updated:
    app_js_updated = app_js_updated.replace(old_check_logic, new_check_logic)
    print("Lógica de puntuación de quizzes actualizada.")
else:
    print("Nota: old_check_logic no encontrada de forma exacta, buscando partes.")

# Actualizar el badge del Examen Final de Reactivo idx+1 / 20 a / 25
app_js_updated = app_js_updated.replace("Reactivo ${idx + 1}/20", "Reactivo ${idx + 1}/${FINAL_EXAM_QUESTIONS.length}")

with open("app.js", "w", encoding="utf-8") as f:
    f.write(app_js_updated)

print("app.js actualizado exitosamente con 50 preguntas de quizzes y 25 de examen final.")
