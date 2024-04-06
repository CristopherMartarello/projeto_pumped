
/**
 * Classe que calcula os dados nescessarios para criação das dietas.
 */
class CalorieCalculator {

    constructor () {

    }


    /**
    * Calcula a Taxa Metabólica Basal (TMB) para um homem.
    * @param {float} weight - O peso do homem em quilogramas.
    * @param {float} height - A altura do homem em centímetros.
    * @param {int} age - A idade do homem em anos.
    * @returns {float} A Taxa Metabólica Basal (TMB) calculada para o homem.
    */
    static calculateTMBMale(weight, height, age) {
        return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    }

    /**
    * Calcula a Taxa Metabólica Basal (TMB) para uma mulher.
    * @param {float} weight - O peso da mulher em quilogramas.
    * @param {float} height - A altura da mulher em centímetros.
    * @param {int} age - A idade da mulher em anos.
    * @returns {float} A Taxa Metabólica Basal (TMB) calculada para a mulher.
    */
    static calculateTMBFemale(weight, height, age) {
        return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    /**
    * Calcula as calorias necessárias para perda de peso com base na Taxa Metabólica Basal (TMB), fator de atividade e déficit calórico.
    * @param {float} TMB - A Taxa Metabólica Basal (TMB) calculada para o indivíduo.
    * @param {string} activityFactor - O fator de atividade do indivíduo.
    * @param {float} deficit - O déficit calórico desejado para a perda de peso.
    * @returns {float} O número de calorias necessárias para perda de peso.
    */
    static caloriesForWeightLoss(TMB, activityFactor, deficit) {
        return (TMB * activityFactor) - deficit;
    }

    /**
    * Calcula as calorias necessárias para ganho de massa muscular com base na Taxa Metabólica Basal (TMB), fator de atividade e superávit calórico.
    * @param {float} TMB - A Taxa Metabólica Basal (TMB) calculada para o indivíduo.
    * @param {string} activityFactor - O fator de atividade do indivíduo.
    * @param {float} superavit - O superávit calórico desejado para o ganho de massa muscular.
    * @returns {float} O número de calorias necessárias para ganho de massa muscular.
    */
    static caloriesForMuscleGain(TMB, activityFactor, superavit) {
        return (TMB * activityFactor) + superavit;
    }

    /**
    * Calcula as calorias necessárias para manter o peso com base na Taxa Metabólica Basal (TMB) e fator de atividade.
    * @param {float} TMB - A Taxa Metabólica Basal (TMB) calculada para o indivíduo.
    * @param {string} activityFactor - O fator de atividade do indivíduo.
    * @returns {float} O número de calorias necessárias para manter o peso.
    */
    static caloriesForMaintance(TMB, activityFactor) {
        return (TMB * activityFactor);
    }

    /**
     * Calcula o Índice de Massa Corporal (IMC) com base no peso e na altura.
    * @param {float} weight - O peso da pessoa em quilogramas.
    * @param {float} height - A altura da pessoa em centímetros.
    * @returns {float} O Índice de Massa Corporal (IMC) calculado.
    */
    static calculateIMC(weight, height) {
        height = height / 100.0;
    
        return weight / (height * height);
    }
}

module.exports = CalorieCalculator;

