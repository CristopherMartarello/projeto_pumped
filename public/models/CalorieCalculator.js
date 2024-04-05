class CalorieCalculator {

    constructor () {

    }
    // taxa de metabolismo basal (TMB) para homens
    static calculateTMBMale(weight, height, age) {
        return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    }

    // taxa de metabolismo basal (TMB) para mulheres
    static calculateTMBFemale(weight, height, age) {
        return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    // calorias necessárias para perder peso
    static caloriesForWeightLoss(TMB, activityFactor, deficit) {
        return (TMB * activityFactor) - deficit;
    }

    // calorias necessárias para ganhar peso
    static caloriesForMuscleGain(TMB, activityFactor, superavit) {
        return (TMB * activityFactor) + superavit;
    }

    // calorias para manter e definir
    static caloriesForMaintance(TMB, activityFactor) {
        return (TMB * activityFactor);
    }

    //calcular o imc
    static calculateIMC(weight, height) {
        height = height / 100.0;
    
        return weight / (height * height);
    }
}

module.exports = CalorieCalculator;

