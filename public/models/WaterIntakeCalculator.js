/**
 * Classe que calculará a quantidade de agua que o usuário deverá beber.
 */
class WaterIntakeCalculator {
    
    /**
    * Calcula a quantidade recomendada de água que o usuário deve tomar com base no peso corporal.
    * @param {number} weight - O peso corporal do usuário, em quilogramas.
    * @returns {number} A quantidade recomendada de água a ser consumida diariamente, em mililitros.
    */
    static calculateWaterIntake(weight) {
        const intakeFactor = 35; // ml/kg

        return weight * intakeFactor;
    }
}

module.exports = WaterIntakeCalculator;