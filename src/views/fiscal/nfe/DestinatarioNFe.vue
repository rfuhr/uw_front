<script setup>
    import { reactive } from 'vue';

    const formData = reactive({
        controlaEstoque: true
    });
</script>

<template>
    <div>
        <div class="grid nested-grid">
            <div class="col-12">
                <UWFieldSet title="Dados do Destinatário" class="h-full">
                    <div class="p-fluid formgrid grid">
                        <UWParceiroLocal id="parceiroLocal" classContainer="col-12 md:col-3" required label="Parceiro" />
                        <UWInput id="cpfCnpj" label="Cnpj" uppercase disabled />
                        <UWInput id="nomeLocal" label="Filial" uppercase disabled  classContainer="col-12 md:col-3" />
                        <UWInput id="nomeLocal" label="Indicador IE" uppercase disabled  classContainer="col-12 md:col-2" />
                        <UWInput id="nomeLocal" label="Inscrição SUFRAMA" uppercase disabled  classContainer="col-12 md:col-2" />
                        <UWInput
                                    id="endereco"
                                    label="Endereço"
                                    uppercase
                                    disabled
                                    classContainer="col-12 md:col-12"
                                />
                        <UWInput id="telefone" label="Telefone" uppercase disabled  classContainer="col-12 md:col-2" />
                        <UWInput id="nomeLocal" label="Email" uppercase disabled  classContainer="col-12 md:col-3" />
                        <div class="field md:col-2 pt-0">
                            <span class="p-float-label">
                                <ToggleButton
                                    v-model="formData.controlaEstoque"
                                    onLabel="Mesmo local de entrega"
                                    offLabel="Local de entrega diferente"
                                    onIcon="pi pi-lock"
                                    offIcon="pi pi-lock-open"
                                    class="w-full"
                                    aria-label="Do you confirm"
                                    @change="changeControlaEstoque"
                                    :pt="{
                                        root: {
                                            class: [{ 'h-full': true, 'bg-green-100 border-white': formData.controlaEstoque, 'bg-purple-100 border-white': !formData.controlaEstoque }]
                                        }
                                    }"
                                />
                            </span>
                        </div>
                    </div>
                </UWFieldSet>
            </div>
            <div class="col-12">
                <UWFieldSet title="Local de Entrega" class="h-full flex flex-column justify-content-start">

                </UWFieldSet>
            </div>
        </div>
    </div>
</template>
