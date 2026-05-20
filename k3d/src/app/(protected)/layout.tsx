// Imports de componentes de Navegação (podemos implementar NavBar para Mobile e uma SideBar para Desktop, por exemplo)
// A ideia seria fazer uma "ativação" de cada componente baseado no quão grande/pequeno esteja a tela do usuário 

export default function ContentLayout({ children }: { children: React.ReactNode }) {
    return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* <Sidebar /> */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* <Header /> */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>);}