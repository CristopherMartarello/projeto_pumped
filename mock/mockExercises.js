/**
 * Mock para simular uma lista de exercícios com informações sobre nome, foco muscular, repetições, séries e tempo de descanso.
 * Este mock é usado para criação de rotinas de treino.
 * @type {Array}
 * @constant
 */
const exercises = [
    { name: 'Supino Reto', focus: 'Peito', rep: 10, series: 3, rest: 60 },
    { name: 'Puxada Alta', focus: 'Costas', rep: 12, series: 4, rest: 90 },
    { name: 'Agachamento Livre', focus: 'Pernas', rep: 10, series: 3, rest: 200 },
    { name: 'Elevação Lateral', focus: 'Ombros', rep: 8, series: 4, rest: 60 },
    { name: 'Rosca Alternada', focus: 'Bíceps', rep: 10, series: 3, rest: 90},
    { name: 'Pulley Corda', focus: 'Tríceps', rep: 12, series: 4, rest: 90},
    { name: 'Abdominais', focus: 'Abdômen', rep: 20, series: 3, rest: 60 },
    { name: 'Supino Inclinado', focus: 'Peito', rep: 10, series: 3, rest: 90 },
    { name: 'Crucifixo Maquina', focus: 'Peito', rep: 10, series: 3, rest: 90 },
    { name: 'Supino Maquina 90°', focus: 'Peito', rep: 12, series: 3, rest: 90 },
    { name: 'Cross Over', focus: 'Peito', rep: 10, series: 3, rest: 120 },
    { name: 'Remada Serrote', focus: 'Costas', rep: 10, series: 4, rest: 90 },
    { name: 'Remada Cavalinho', focus: 'Costas', rep: 10, series: 4, rest: 90 },
    { name: 'Remada Corda', focus: 'Costas', rep: 10, series: 4, rest: 90 },
    { name: 'Puxada Alta Inversa', focus: 'Costas', rep: 10, series: 4, rest: 90 },
    { name: 'Leg Press 45', focus: 'Pernas', rep: 10, series: 3, rest: 200 },
    { name: 'Hack Squat', focus: 'Pernas', rep: 10, series: 3, rest: 240 },
    { name: 'Cadeira Extensora', focus: 'Pernas', rep: 10, series: 4, rest: 120 },
    { name: 'Agachamento Bulgaro', focus: 'Pernas', rep: 10, series: 3, rest: 200 },
    { name: 'Press de Ombros', focus: 'Ombros', rep: 10, series: 3, rest: 60 },
    { name: 'Elevação Frontal', focus: 'Ombros', rep: 10, series: 4, rest: 60 },
    { name: 'Prensa de Ombro Maquina', focus: 'Ombros', rep: 8, series: 4, rest: 90 },
    { name: 'Remada Alta', focus: 'Ombros', rep: 12, series: 3, rest: 60 },
    { name: 'Rosca Direta', focus: 'Bíceps', rep: 12, series: 3, rest: 120},
    { name: 'Rosca Martelo', focus: 'Bíceps', rep: 8, series: 4, rest: 90},
    { name: 'Rosca Concentrada', focus: 'Bíceps', rep: 10, series: 4, rest: 90},
    { name: 'Rosca na Polia', focus: 'Bíceps', rep: 10, series: 3, rest: 120},
    { name: 'Triceps Frances', focus: 'Tríceps', rep: 10, series: 4, rest: 90},
    { name: 'Supino Fechado', focus: 'Tríceps', rep: 12, series: 4, rest: 120},
    { name: 'Triceps Testa', focus: 'Tríceps', rep: 10, series: 4, rest: 90},
    { name: 'Paralela', focus: 'Tríceps', rep: 10, series: 3, rest: 60},
    { name: 'Abdominal Declinado', focus: 'Abdômen', rep: 20, series: 3, rest: 60 },
    { name: 'Abdominal em L', focus: 'Abdômen', rep: 20, series: 3, rest: 60 },
    { name: 'Prancha', focus: 'Abdômen', rep: 20, series: 3, rest: 60 },
    { name: 'Roda Abdominal', focus: 'Abdômen', rep: 20, series: 3, rest: 60 },
];

module.exports = exercises;