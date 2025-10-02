package hub.orcana.tables;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum TipoUsuario {
    admin,
    cliente;


    @JsonCreator
    public static TipoUsuario from(String value) {
        return TipoUsuario.valueOf(value.toLowerCase());
    }
    }

