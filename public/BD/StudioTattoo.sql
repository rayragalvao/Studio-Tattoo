CREATE DATABASE StudioTattoo;
USE StudioTattoo;
-- -----------------------------------------------------
-- Tabela `usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NULL,
  `telefone` VARCHAR(20) NULL,
  `senha` VARCHAR(255) NULL,
  `data_nascimento` DATE NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Tabela `orcamentos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `orcamentos` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `descricao` TEXT NULL,
  `valor` DECIMAL(10,2) NULL,
  `tamanho` DECIMAL(10,2) NULL,
  `estilo` VARCHAR(100) NULL,
  `tempo` TIME NULL,
  `usuario_id` BIGINT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_orcamentos_usuarios_idx` (`usuario_id` ASC) VISIBLE,
  CONSTRAINT `fk_orcamentos_usuarios`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `usuarios` (`id`)
    ON DELETE SET NULL
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Tabela `agendamentos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `agendamentos` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `data_hora` TIMESTAMP NOT NULL,
  `status` VARCHAR(50) NULL,
  `usuario_id` BIGINT NULL,
  `orcamento_id` BIGINT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_agendamentos_usuarios_idx` (`usuario_id` ASC) VISIBLE,
  INDEX `fk_agendamentos_orcamentos_idx` (`orcamento_id` ASC) VISIBLE,
  CONSTRAINT `fk_agendamentos_usuarios`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `usuarios` (`id`)
    ON DELETE SET NULL
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_agendamentos_orcamentos`
    FOREIGN KEY (`orcamento_id`)
    REFERENCES `orcamentos` (`id`)
    ON DELETE SET NULL
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Tabela `relatorios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `relatorios` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `descricao` TEXT NULL,
  `agendamento_id` BIGINT NULL,
  `usuario_id` BIGINT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `agendamento_id_UNIQUE` (`agendamento_id` ASC) VISIBLE,
  UNIQUE INDEX `usuario_id_UNIQUE` (`usuario_id` ASC) VISIBLE,
  CONSTRAINT `fk_relatorios_agendamentos`
    FOREIGN KEY (`agendamento_id`)
    REFERENCES `agendamentos` (`id`)
    ON DELETE SET NULL
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_relatorios_usuarios`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `usuarios` (`id`)
    ON DELETE SET NULL
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Tabela `equipamentos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `equipamentos` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(255) NOT NULL,
  `quantidade` DECIMAL(10,2) NOT NULL,
  `unidade_medida` VARCHAR(50) NOT NULL,
  `minimo_aviso` DECIMAL(10,2) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Tabela `equipamento_uso`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `equipamento_uso` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `quantidade` INT NOT NULL,
  `equipamento_id` BIGINT NULL,
  `relatorio_id` BIGINT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_equipamento_uso_equipamentos_idx` (`equipamento_id` ASC) VISIBLE,
  INDEX `fk_equipamento_uso_relatorios_idx` (`relatorio_id` ASC) VISIBLE,
  CONSTRAINT `fk_equipamento_uso_equipamentos`
    FOREIGN KEY (`equipamento_id`)
    REFERENCES `equipamentos` (`id`)
    ON DELETE SET NULL
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_equipamento_uso_relatorios`
    FOREIGN KEY (`relatorio_id`)
    REFERENCES `relatorios` (`id`)
    ON DELETE SET NULL
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Tabela `orcamento_cores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `orcamento_cores` (
  `orcamento_id` BIGINT NOT NULL,
  `cor` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`orcamento_id`, `cor`),
  CONSTRAINT `fk_orcamento_cores_orcamentos`
    FOREIGN KEY (`orcamento_id`)
    REFERENCES `orcamentos` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;