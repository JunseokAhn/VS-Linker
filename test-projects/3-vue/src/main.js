// Vue.js @ Alias 테스트

import { createApp } from 'vue';
import Button from '@/components/Button.vue';
import Home from '@/views/Home.vue';

const app = createApp({
    components: {
        Button,
        Home
    },
    template: `
        <div>
            <Home />
            <Button />
        </div>
    `
});

app.mount('#app');
