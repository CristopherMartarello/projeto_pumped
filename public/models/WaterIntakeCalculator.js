class WaterIntakeCalculator {
    // quantidade de água necessária com base no peso corporal (35 ml/kg)
    static calculateWaterIntake(weight) {
        const intakeFactor = 35; // ml/kg

        return weight * intakeFactor;
    }
}

module.exports = WaterIntakeCalculator;