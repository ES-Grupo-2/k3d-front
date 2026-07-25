/**
 * @author lukasnascimento1
 * @author jvs-neves
 */
// Configuração do adaptador OpenNext para deploy no Cloudflare Workers.
// Converte o build do Next em um Worker executável na edge. Sem cache incremental
// externo por enquanto — dá para plugar R2 depois caso ISR/cache passe a ser necessário.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({});
