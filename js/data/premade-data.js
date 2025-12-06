
/**
 * Premade Data
 * Centralized data structure for premade items
 */
(function () {
    const PREMADE_DATA = [
        {
            id: 'vowels',
            date: '2025-12-06',
            tags: ['vowels', 'beginner', 'alphabet'],
            image: 'assets/premade/preview/POJ_LiansipChoa_Vowels.jpg',
            pdfUrl: 'assets/premade/POJ_LiansipChoa_Vowels.pdf',
            description: {
                en: 'a, i, u, o͘, e, o',
                poj: 'a, i, u, o͘, e, o'
            }
        },
        {
            id: 'consonants',
            date: '2025-12-06',
            tags: ['consonants', 'beginner', 'alphabet'],
            image: 'assets/premade/preview/POJ_LiansipChoa_Consonants.jpg',
            pdfUrl: 'assets/premade/POJ_LiansipChoa_Consonants.pdf',
            description: {
                en: 'p, ph, m, b...',
                poj: 'p, ph, m, b...'
            }
        },
        {
            id: 'tones',
            date: '2025-12-06',
            tags: ['tones', 'beginner'],
            image: 'assets/premade/preview/POJ_LiansipChoa_Tones.jpg',
            pdfUrl: 'assets/premade/POJ_LiansipChoa_Tones.pdf',
            description: {
                en: '8 tones',
                poj: '8 siaⁿ-tiāu'
            }
        },
        {
            id: 'nasal_vowels',
            date: '2025-12-06',
            tags: ['nasal', 'vowels', 'beginner'],
            image: 'assets/premade/preview/POJ_LiansipChoa_NasalVowels.jpg',
            pdfUrl: 'assets/premade/POJ_LiansipChoa_NasalVowels.pdf',
            description: {
                en: 'aⁿ, iⁿ, oⁿ, eⁿ',
                poj: 'aⁿ, iⁿ, oⁿ, eⁿ'
            }
        },
        {
            id: 'nasal_diphthongs',
            date: '2025-12-06',
            tags: ['nasal', 'beginner'],
            image: 'assets/premade/preview/POJ_LiansipChoa_NasalDiphthongs.jpg',
            pdfUrl: 'assets/premade/POJ_LiansipChoa_NasalDiphthongs.pdf',
            description: {
                en: 'aiⁿ, auⁿ, iaⁿ, iuⁿ...',
                poj: 'aiⁿ, auⁿ, iaⁿ, iuⁿ...'
            }
        }
    ];

    // Define tag order: categories first, then difficulty
    const TAG_ORDER = ['alphabet', 'vowels', 'nasal', 'consonants', 'tones', 'beginner'];

    /**
     * Get all unique tags from premade data in defined order
     * @returns {Array} Array of unique tag strings
     */
    function getAllTags() {
        const tagsSet = new Set();
        PREMADE_DATA.forEach(item => {
            item.tags.forEach(tag => tagsSet.add(tag));
        });
        // Sort by TAG_ORDER, unknown tags go to end alphabetically
        return Array.from(tagsSet).sort((a, b) => {
            const indexA = TAG_ORDER.indexOf(a);
            const indexB = TAG_ORDER.indexOf(b);
            if (indexA === -1 && indexB === -1) return a.localeCompare(b);
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        });
    }

    window.App.Data.Premade = {
        items: PREMADE_DATA,
        getAllTags: getAllTags
    };
})();
