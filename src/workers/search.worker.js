/**
 * search.worker.js
 * -----------------
 * بيشتغل في Thread منفصل عن الواجهة، فحتى لو البحث ياخد وقت (مع عدد كبير
 * من الصفوف) الموقع نفسه بيفضل سلس ومش هيعمل "تجميد" (freeze) وانت بتكتب.
 */

import { loadDataset } from '../utils/dataProvider';
import { buildIndex, search } from '../utils/searchEngine';

let dataset = null;
let index = null;

self.onmessage = async (event) => {
    const { type, payload } = event.data;

    if (type === 'INIT') {
        try {
            dataset = await loadDataset(payload.dataUrl, (progress) => {
                self.postMessage({ type: 'LOAD_PROGRESS', payload: progress });
            });
            index = buildIndex(dataset);

            self.postMessage({
                type: 'READY',
                payload: {
                    columns: dataset.columns,
                    totalRecords: dataset.rows.length,
                    nameColumnIndex: dataset.nameColumnIndex,
                    seatColumnIndex: dataset.seatColumnIndex,
                },
            });
        } catch (error) {
            self.postMessage({ type: 'ERROR', payload: error.message });
        }
        return;
    }

    if (type === 'SEARCH') {
        if (!dataset || !index) {
            self.postMessage({
                type: 'ERROR',
                payload: 'البيانات لسه متحملتش.',
            });
            return;
        }

        const query = payload.query;
        const { indices, totalMatches } = search(dataset, index, query);
        const results = indices.map((rowIdx) => dataset.rows[rowIdx]);

        self.postMessage({
            type: 'SEARCH_RESULTS',
            payload: { query, results, totalMatches, columns: dataset.columns },
        });
    }
};
