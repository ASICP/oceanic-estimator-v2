{ pkgs }: {
  deps = [
    pkgs.nodejs-20
    pkgs.nodePackages.typescript-language-server
    pkgs.yarn
    pkgs.replitPackages.jest
    pkgs.postgresql
  ];
}
