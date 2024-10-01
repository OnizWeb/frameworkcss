/**
 * 
 * @param {string} name nom de l'icon
 * @return {string} Retourne le SVG 
 */

export async function getIcon(name) {
    try {
        const httpRequest = await fetch(`http://localhost:6969/assets/icons/${name}.svg`);
    
        const svg = await httpRequest.text();
    
        if (!svg) {
            throw new Error("ERROR_GET_SVG")
        }

        return svg;
        
    } catch (error) {
        throw new Error("ERROR_GET_SVG")
    }
}

/**
 * 
 * @param {string} name nom de l'icon
 * @return {string} Retourne le SVG 
 */

export async function getIconWeather(name) {
    try {
        const httpRequest = await fetch(`http://localhost:6969/assets/icons/weather/${name}.svg`);
    
        const svg = await httpRequest.text();
    
        if (!svg) {
            throw new Error("ERROR_GET_WEATHER_SVG")
        }

        return svg;
        
    } catch (error) {
        throw new Error("ERROR_GET_WEATHER_SVG")
    }
}