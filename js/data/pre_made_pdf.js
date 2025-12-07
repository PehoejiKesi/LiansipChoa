
/**
 * Pre-made PDF Data
 * Centralized data structure for pre-made PDF items
 */
(function () {
    const PRE_MADE_PDF_DATA = [
        {
            id: 'vowels',
            date: '2025-12-07',
            tags: ['vowels', 'codas', 'beginner', 'alphabet', 'A4'],
            image: 'assets/pre_made/preview/POJ_LiansipChoa_Boim.jpg',
            pdfUrl: 'assets/pre_made/POJ_LiansipChoa_Boim.pdf',
            description: {
                en: 'a, i, u, o͘, e, o',
                poj: 'a, i, u, o͘, e, o'
            }
        },
        {
            id: 'consonants',
            date: '2025-12-07',
            tags: ['consonants', 'initials', 'beginner', 'alphabet', 'A4'],
            image: 'assets/pre_made/preview/POJ_LiansipChoa_Chuim.jpg',
            pdfUrl: 'assets/pre_made/POJ_LiansipChoa_Chuim.pdf',
            description: {
                en: 'p, ph, m, b...',
                poj: 'p, ph, m, b...'
            }
        },
        {
            id: 'tones',
            date: '2025-12-07',
            tags: ['tones', 'beginner', 'A4'],
            image: 'assets/pre_made/preview/POJ_LiansipChoa_Sianntiau.jpg',
            pdfUrl: 'assets/pre_made/POJ_LiansipChoa_Sianntiau.pdf',
            description: {
                en: '8 tones',
                poj: '8 siaⁿ-tiāu'
            }
        },
        {
            id: 'nasal_vowels',
            date: '2025-12-07',
            tags: ['nasal', 'vowels', 'codas', 'beginner', 'A4'],
            image: 'assets/pre_made/preview/POJ_LiansipChoa_PhinnimHoaKooBoimJiboe.jpg',
            pdfUrl: 'assets/pre_made/POJ_LiansipChoa_PhinnimHoaKooBoimJiboe.pdf',
            description: {
                en: 'aⁿ, iⁿ, oⁿ, eⁿ',
                poj: 'aⁿ, iⁿ, oⁿ, eⁿ'
            }
        },
        {
            id: 'nasal_diphthongs',
            date: '2025-12-07',
            tags: ['nasal', 'vowels', 'codas', 'beginner', 'A4'],
            image: 'assets/pre_made/preview/POJ_LiansipChoa_PhinnimHoaHokBoimJiboe.jpg',
            pdfUrl: 'assets/pre_made/POJ_LiansipChoa_PhinnimHoaHokBoimJiboe.pdf',
            description: {
                en: 'aiⁿ, auⁿ, iaⁿ, iuⁿ...',
                poj: 'aiⁿ, auⁿ, iaⁿ, iuⁿ...'
            }
        },
        {
            id: 'nasal_codas',
            date: '2025-12-07',
            tags: ['nasal', 'codas', 'beginner', 'A4'],
            image: 'assets/pre_made/preview/POJ_LiansipChoa_PhinnChuimBoeliuJiboe.jpg',
            pdfUrl: 'assets/pre_made/POJ_LiansipChoa_PhinnChuimBoeliuJiboe.pdf',
            description: {
                en: 'am, an, ang, im, in...',
                poj: 'am, an, ang, im, in...'
            }
        },
        {
            id: 'basic_stop_codas',
            date: '2025-12-07',
            tags: ['stop', 'codas', 'A4'],
            image: 'assets/pre_made/preview/POJ_LiansipChoa_KipunSokimJiboe.jpg',
            pdfUrl: 'assets/pre_made/POJ_LiansipChoa_KipunSokimJiboe.pdf',
            description: {
                en: 'ap, at, ak, ah, ip, it...',
                poj: 'ap, at, ak, ah, ip, it...'
            }
        },
        {
            id: 'ptk_stop_codas',
            date: '2025-12-07',
            tags: ['stop', 'codas', 'A4'],
            image: 'assets/pre_made/preview/POJ_LiansipChoa_PTKSokimJiboe.jpg',
            pdfUrl: 'assets/pre_made/POJ_LiansipChoa_PTKSokimJiboe.pdf',
            description: {
                en: 'ap, at, ak, ip, it...',
                poj: 'ap, at, ak, ip, it...'
            }
        },
        {
            id: 'kinajit_paikui',
            date: '2025-12-07',
            tags: ['words', 'A4'],
            image: 'assets/pre_made/preview/POJ_LiansipChoa_KinajitPaiKui.jpg',
            pdfUrl: 'assets/pre_made/POJ_LiansipChoa_KinajitPaiKui.pdf',
            description: {
                en: "Days of the week",
                poj: 'pài-it, pài-jī, pài-saⁿ...'
            }
        },
        {
            id: 'tones_mnemonic',
            date: '2025-12-07',
            tags: ['tones', 'words', 'beginner', 'A4'],
            image: 'assets/pre_made/preview/POJ_LiansipChoa_8SianntiauKhaukoat.jpg',
            pdfUrl: 'assets/pre_made/POJ_LiansipChoa_8SianntiauKhaukoat.pdf',
            description: {
                en: "8 tones mnemonic",
                poj: '8 siaⁿ-tiāu kháu-koat'
            }
        },
    ];

    // Define tag order: categories first, then difficulty
    const TAG_ORDER = ['alphabet', 'vowels', 'consonants', 'nasal', 'stop', 'initials', 'codas', 'tones', 'words', 'beginner', 'A4'];

    /**
     * Get all unique tags from premade data in defined order
     * @returns {Array} Array of unique tag strings
     */
    function getAllTags() {
        const tagsSet = new Set();
        PRE_MADE_PDF_DATA.forEach(item => {
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
        items: PRE_MADE_PDF_DATA,
        getAllTags: getAllTags,
        tagOrder: TAG_ORDER
    };
})();
