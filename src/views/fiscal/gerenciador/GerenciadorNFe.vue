<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { NFeService } from '@/service';
import { useContexto } from '@/stores';
import { useFormatDate } from '@/composables/useFormatDate';

const router = useRouter();
const contextoStore = useContexto();
const { formatToDDMMYYYYHHMMSS } = useFormatDate();
const listagem = ref([]);

const novaNFe = () => {
    router.push({ name: 'fis-nfe-nova' });
};

onMounted(() => {
    NFeService.getListaNFe(contextoStore.contexto.empresaFilialId).then((response) => {
        listagem.value = response;
    });
});

const getBadgeSeverity = (status) => {
    switch (status.toLowerCase()) {
        case 'em digitação':
            return 'contrast';
        default:
            return 'info';
    }
};

const openEdit = (selectId) => {
    router.push({name: 'fis-nfe-editar', params: {
        id: selectId
    }})
};

const enviarNFe = (selectId) => {
    NFeService.enviarNFe(selectId).then((response) => {
        const disposition = response.headers['content-disposition'];
            const fileNameRegex = /filename[^;=\n]=((['"]).?\2|[^;\n]*)/;
            const matches = fileNameRegex.exec(disposition);
            const filename = matches != null && matches[1] ? matches[1].replace(/['"]/g, '') : 'Nfe.pdf';

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();        
    });
};

</script>

<template>
    <UWPageBase title="Gerenciador de NFe">
        <DataTable
            ref="tableCrud"
            size="small"
            class="p-datatable-sm"
            :value="listagem"
            dataKey="id"
            :paginator="true"
            :rows="10"
            :filters="filters"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} notas"
        >
            <template #header>
                <div class="flex flex-wrap gap-2 align-items-center justify-content-end">
                    <Button type="button" icon="pi pi-user-plus" label="Iniciar NFe" class="w-full sm:w-auto flex-order-0 sm:flex-order-1" outlined @click="novaNFe" />
                </div>
            </template>
            <Column field="dataHoraEmissao" header="Data / Hora Emissão" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">Data / Hora Emissão</span>
                    {{ formatToDDMMYYYYHHMMSS(slotProps.data.dataHoraEmissao) }}
                </template>
            </Column>
            <Column field="chaveNFe" header="Chave NFe" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">Chave NFe</span>
                    {{ slotProps.data.chaveNFe }}
                </template>
            </Column>
            <Column field="serie" header="Série" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">Série</span>
                    {{ slotProps.data.serie }}
                </template>
            </Column>
            <Column field="numero" header="Número" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">Número</span>
                    {{ slotProps.data.numero }}
                </template>
            </Column>
            <Column field="situacao" header="Situação" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">Situação</span>
                    <Tag :severity="getBadgeSeverity(slotProps.data.situacao)">{{ slotProps.data.situacao }}</Tag>
                </template>
            </Column>

            <Column style="width: 10%">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" class="p-button-secundary p-button-sm mr-2" @click="openEdit(slotProps.data.nfeId)" />
                    <Button icon="pi pi-send" class="p-button-success p-button-sm mr-2" @click="enviarNFe(slotProps.data.nfeId)" />
                </template>
            </Column>
        </DataTable>
    </UWPageBase>
</template>
